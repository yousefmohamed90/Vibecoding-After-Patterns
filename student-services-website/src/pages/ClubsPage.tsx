import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const { clubService } = useServices();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userClubs, setUserClubs] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  useEffect(() => {
    loadClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadClubs = () => {
    setLoading(true);
    try {
      const data = clubService.getAvailableClubs();
      setClubs(Array.isArray(data) ? data : []);
      
      if (user) {
        const memberships = clubService.getStudentMemberships(user.userId);
        setUserClubs(memberships.map((m: any) => m.resourceID));
      }
    } catch (error) {
      toast.error('Failed to load clubs');
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId: string) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setBookingLoading(clubId);
    try {
      await clubService.chooseClub(user.userId, clubId);
      toast.success('✅ Joined club successfully!');
      setUserClubs([...userClubs, clubId]);
    } catch (error) {
      toast.error('Failed to join club');
    } finally {
      setBookingLoading(null);
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    if (!user) return;

    setBookingLoading(clubId);
    try {
      await clubService.cancelClubMembership(user.userId, clubId);
      toast.success('✅ Left club successfully!');
      setUserClubs(userClubs.filter(c => c !== clubId));
    } catch (error) {
      toast.error('Failed to leave club');
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-purple-600" size={36} />
          Student Clubs
        </h1>
        <p className="text-gray-600 mt-2">Join clubs and connect with fellow students</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <Card className="bg-gray-50 p-8 text-center">
          <p className="text-gray-600 text-lg">No clubs available</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club: any) => {
            const isJoined = userClubs.includes(club.clubID);
            return (
              <Card key={club.clubID} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-purple-600" size={20} />
                  <h3 className="text-xl font-bold">{club.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{club.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-2 text-green-600">
                    <DollarSign size={18} />
                    ${club.membershipFee || 'Free'}
                  </span>
                </div>
                <Button
                  className="w-full"
                  variant={isJoined ? 'outline' : 'primary'}
                  onClick={() => isJoined ? handleLeaveClub(club.clubID) : handleJoinClub(club.clubID)}
                  disabled={bookingLoading === club.clubID}
                >
                  {bookingLoading === club.clubID ? 'Loading...' : isJoined ? 'Leave Club' : 'Join Club'}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
