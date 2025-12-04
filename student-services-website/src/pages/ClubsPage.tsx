// src/pages/ClubsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Club } from '../entities/Club';
import { Booking } from '../entities/Booking';
import { Users, DollarSign, Calendar, Heart, AlertCircle, Star, Award } from 'lucide-react';
import { toast } from 'sonner';

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const { controller, clubService } = useServices();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myMemberships, setMyMemberships] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningClubId, setJoiningClubId] = useState<string | null>(null);
  const [showMemberships, setShowMemberships] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setLoading(true);
    try {
      const allClubs = clubService.getAvailableClubs();
      setClubs(allClubs);

      if (user) {
        const memberships = clubService.getStudentMemberships(user.userId);
        setMyMemberships(memberships);
      }
    } catch (error) {
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = (club: Club) => {
    if (!user) {
      toast.error('Please login to join clubs');
      return;
    }

    // Check if already a member
    const alreadyMember = myMemberships.some(
      m => m.resourceID === club.clubID && m.status !== 'CANCELLED'
    );

    if (alreadyMember) {
      toast.error('You are already a member of this club');
      return;
    }

    setSelectedClub(club);
    setShowJoinModal(true);
  };

  const confirmJoinClub = async () => {
    if (!selectedClub || !user) return;

    setJoiningClubId(selectedClub.clubID);
    setShowJoinModal(false);

    try {
      await controller.handleClubRequest(user.userId, selectedClub.clubID);
      toast.success(`Successfully joined ${selectedClub.name}! Welcome aboard! 🎉`);
      loadData();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to join club');
    } finally {
      setJoiningClubId(null);
      setSelectedClub(null);
    }
  };

  const handleLeaveClub = async (clubID: string, clubName: string) => {
    if (!user) return;

    if (!window.confirm(`Are you sure you want to leave ${clubName}?`)) {
      return;
    }

    try {
      clubService.cancelClubMembership(user.userId, clubID);
      toast.success(`You have left ${clubName}`);
      loadData();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to leave club');
    }
  };

  const getClubIcon = (category?: string) => {
    const icons: Record<string, string> = {
      'Arts': '🎨',
      'Technology': '💻',
      'Academic': '📚',
      'Sports': '⚽',
      'Music': '🎵',
      'default': '🎭'
    };
    return icons[category || 'default'] || icons.default;
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Arts': 'from-purple-400 to-purple-600',
      'Technology': 'from-blue-400 to-blue-600',
      'Academic': 'from-green-400 to-green-600',
      'Sports': 'from-red-400 to-red-600',
      'Music': 'from-pink-400 to-pink-600',
      'default': 'from-gray-400 to-gray-600'
    };
    return colors[category || 'default'] || colors.default;
  };

  const categories = ['ALL', ...Array.from(new Set(clubs.map(c => c.category).filter(Boolean)))];

  const filteredClubs = filterCategory === 'ALL'
    ? clubs
    : clubs.filter(c => c.category === filterCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Clubs</h1>
        <p className="text-gray-600">Join exciting clubs and expand your horizons</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Clubs</p>
              <p className="text-3xl font-bold text-purple-600">{clubs.length}</p>
            </div>
            <Users className="text-purple-600" size={40} />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Memberships</p>
              <p className="text-3xl font-bold text-blue-600">{myMemberships.length}</p>
            </div>
            <Award className="text-blue-600" size={40} />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-green-600">
                {clubs.reduce((sum, club) => sum + (club.memberCount || 0), 0)}
              </p>
            </div>
            <Heart className="text-green-600" size={40} />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={!showMemberships ? 'primary' : 'outline'}
          onClick={() => setShowMemberships(false)}
        >
          All Clubs
        </Button>
        <Button
          variant={showMemberships ? 'primary' : 'outline'}
          onClick={() => setShowMemberships(true)}
        >
          My Memberships ({myMemberships.length})
        </Button>
      </div>

      {!showMemberships ? (
        <>
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${filterCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club, idx) => {
              const isMember = myMemberships.some(
                m => m.resourceID === club.clubID && m.status !== 'CANCELLED'
              );

              return (
                <Card
                  key={club.clubID}
                  className="flex flex-col animate-slide-up relative"
                >
                  {isMember && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="success">
                        <Star size={12} className="mr-1" />
                        Member
                      </Badge>
                    </div>
                  )}

                  {/* Club Icon */}
                  <div className={`bg-gradient-to-br ${getCategoryColor(club.category)} h-32 rounded-t-lg -m-6 mb-4 flex items-center justify-center text-6xl`}>
                    {getClubIcon(club.category)}
                  </div>

                  {/* Details */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>

                  {club.category && (
                    <Badge variant="default" className="mb-3 w-fit">
                      {club.category}
                    </Badge>
                  )}

                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {club.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {club.memberCount !== undefined && (
                      <div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-2" />
                        <span className="text-sm">{club.memberCount} members</span>
                      </div>
                    )}

                    {club.meetingSchedule && (
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm">{club.meetingSchedule}</span>
                      </div>
                    )}

                    <div className="flex items-center text-purple-600">
                      <DollarSign size={16} className="mr-2" />
                      <span className="text-lg font-bold">${club.membershipFee}</span>
                      <span className="text-sm text-gray-600 ml-2">membership fee</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleJoinClub(club)}
                    className="w-full"
                    disabled={isMember || joiningClubId !== null}
                    isLoading={joiningClubId === club.clubID}
                    variant={isMember ? 'outline' : 'primary'}
                  >
                    {isMember ? 'Already a Member' : 'Join Club'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        /* My Memberships Section */
        <div className="space-y-4">
          {myMemberships.length === 0 ? (
            <Card className="text-center py-12">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg mb-2">No club memberships yet</p>
              <p className="text-gray-500 text-sm mb-4">
                Join a club to connect with like-minded students!
              </p>
              <Button onClick={() => setShowMemberships(false)}>
                Explore Clubs
              </Button>
            </Card>
          ) : (
            myMemberships.map((membership, idx) => {
              const club = clubs.find(c => c.clubID === membership.resourceID);
              if (!club) return null;

              return (
                <Card
                  key={membership.bookingID}
                  className="animate-slide-up"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-5xl">
                        {getClubIcon(club.category)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold">{club.name}</h3>
                          <Badge variant={membership.status === 'CONFIRMED' ? 'success' : 'warning'}>
                            {membership.status}
                          </Badge>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{club.description}</p>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Category:</p>
                            <p className="font-medium">{club.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Members:</p>
                            <p className="font-medium">{club.memberCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Joined:</p>
                            <p className="font-medium">
                              {new Date(membership.bookingDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Fee Paid:</p>
                            <p className="font-medium text-green-600">${membership.totalAmount}</p>
                          </div>
                        </div>

                        {club.meetingSchedule && (
                          <div className="mt-3 p-2 bg-blue-50 rounded">
                            <p className="text-sm text-blue-800">
                              📅 Meetings: {club.meetingSchedule}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {membership.status !== 'CANCELLED' && (
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleLeaveClub(club.clubID, club.name)}
                        >
                          Leave Club
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Join Confirmation Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setSelectedClub(null);
        }}
        title="Join Club"
      >
        {selectedClub && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {getClubIcon(selectedClub.category)}
              </div>
              <h3 className="text-2xl font-bold mb-2">{selectedClub.name}</h3>
              {selectedClub.category && (
                <Badge variant="default" className="mb-2">
                  {selectedClub.category}
                </Badge>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-gray-600">{selectedClub.description}</p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {selectedClub.memberCount !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500">Members:</p>
                    <p className="font-semibold">{selectedClub.memberCount}</p>
                  </div>
                )}
                {selectedClub.meetingSchedule && (
                  <div>
                    <p className="text-xs text-gray-500">Meetings:</p>
                    <p className="font-semibold text-sm">{selectedClub.meetingSchedule}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Membership Fee:</span>
                <span className="text-purple-600">${selectedClub.membershipFee}</span>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  ✨ By joining, you'll get access to all club activities, meetings, and events!
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={confirmJoinClub}
                className="flex-1"
              >
                Confirm & Join
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowJoinModal(false);
                  setSelectedClub(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
