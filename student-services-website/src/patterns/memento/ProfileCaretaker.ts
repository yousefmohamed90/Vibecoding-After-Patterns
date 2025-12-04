import { ProfileMemento } from './ProfileMemento'
export class ProfileCaretaker { private mementos: ProfileMemento[] = []
  save(m: ProfileMemento) { this.mementos.push(m) }
}
