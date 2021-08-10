import { FilesCollection } from 'meteor/ostrio:files'
import { Meteor } from 'meteor/meteor'

export const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ?
      `../../../../../uploads/images` :
      Meteor.absoluteUrl().indexOf('ecodesarrollo.cl') != -1 ?
        "/home/ecousuario/uploads/images" : "/home/ecousuario/uploads/images";
  },
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Por favor, sube imagenes con tamaño menor a 10MB';
  }
});

export const Documents = new FilesCollection({
  collectionName: 'Documents',
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ?
      `../../../../../uploads/documents` :
      Meteor.absoluteUrl().indexOf('ecodesarrollo.cl') != -1 ?
        "/home/ecousuario/uploads/documents" : "/home/ecousuario/uploads/documents";
  },
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /pdf|doc|docx|xls|xlsx/i.test(file.extension)) {
      return true;
    }
    return 'Por favor, sube documentos con tamaño menor a 10MB';
  }
});

