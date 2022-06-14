import { Template } from 'meteor/templating'
import { Images } from '../../../lib/collections/FilesCollections'

Template.cuadrilla.helpers({
  imagenCuadrilla(id: string) {
    const img = Images.findOne({
      "meta.ecoOrganizacionId": id,
      "meta.tipo": "ecoorganizacion"
    })
    return img ? img.link() : '/img/no_image_available.jpg'
  }
})