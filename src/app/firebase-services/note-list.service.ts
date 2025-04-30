import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, limit, where } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  normalNotes: Note[] = [];
  trashNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];
  unsubNotes;
  unsubTrash;
  unsubMarkedNotes;
  // unsubSingle;

  // items$;
  // items: any;
  firestore: Firestore = inject(Firestore);


  constructor() {
    // this.items$ = collectionData(this.getNotesRef());
    // this.items = this.items$.subscribe((list) => {
    //   list.forEach(element => {
    //     console.log(element);
    //   });
    // });

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
    this.unsubMarkedNotes = this.subMarkedNotesList();

    // this.unsubSingle = onSnapshot(this.getSingleDocRef('notes', 'hJAeKTdePwPhEsGrn3MZ'), (element) => {
    // });

    // this.unsubSingle();
  }

  // const itemCollection = collection(this.firestore, 'items');

  async addNote(item: Note, colId: 'notes' | 'trash') {
    const collectionRef = colId === 'notes' ? this.getNotesRef() : this.getTrashRef();

    await addDoc(collectionRef, item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  async updateNote(note: Note) {
    if (note.id) {
      await updateDoc(this.getSingleDocRef(this.getColIdFromNote(note), note.id), this.getCleanJson(note))
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId))
      .catch((err) => {
        console.error(err);
      });
  }

  getColIdFromNote(note: Note): string {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  ngOnDestroy() {
    // this.items.unsubscribe();
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }

  subNotesList() {
    const q = query(this.getNotesRef(), limit(100));

    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
      list.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('New note: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('Modified note: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed note: ', change.doc.data());
        }
      });
    })
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where('marked', '==', true), limit(3));

    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
      });
    })
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    })
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked = false,
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}