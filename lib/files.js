import { FilesCollection } from 'meteor/ostrio:files';

var HomePath = process.env.PWD ? process.env.PWD : process.cwd();

Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ?
      `../../../../../uploads/images` :
      Meteor.absoluteUrl().indexOf('ecodesarrollo.cl') != -1 ?
      "/home/ecousuario/uploads/images" : "/home/ecousuario/uploads/images";
  },
  /*transport: Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ? 'http' : 'https',
   */
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Por favor, sube imagenes con tamaño menor a 10MB';
  }
});

Documents = new FilesCollection({
  collectionName: 'Documents',
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ?
      `../../../../../uploads/documents` :
      Meteor.absoluteUrl().indexOf('ecodesarrollo.cl') != -1 ?
      "/home/ecousuario/uploads/documents" : "/home/ecousuario/uploads/documents";
  },
  /*transport: Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ? 'http' : 'https',
   */
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /pdf|doc|docx|xls|xlsx/i.test(file.extension)) {
      return true;
    }
    return 'Por favor, sube documentos con tamaño menor a 10MB';
  }
});

