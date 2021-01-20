import { FilesCollection } from 'meteor/ostrio:files';

var HomePath = process.env.PWD ? process.env.PWD : process.cwd();

Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ?
      `../../../../../uploads` :
      Meteor.absoluteUrl().indexOf('juegas.cl') != -1 ?
      "/home/neo/uploads" : "/home/neo/uploads";
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

Capsulas = new FilesCollection({
  collectionName: 'Capsulas',
  allowClientCode: true,
  storagePath: () => {
    return Meteor.absoluteUrl().indexOf('localhost:3000') != -1 ?
      `../../../../../uploads` :
      Meteor.absoluteUrl().indexOf('juegas.cl') != -1 ?
      "/home/neo/uploads" : "/home/neo/uploads";
  },
  onBeforeUpload(file) {
    if (file.size <= 31457280 && /mp4/i.test(file.extension)) {
      return true;
    }
    return 'Por favor, suba videos MP4 con tamaña menos a 30MB';
  }
});