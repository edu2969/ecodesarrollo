import { Template } from 'meteor/templating'
import { Images } from '../../../lib/collections/FilesCollections'

Template.avatar.helpers({
  imagenAvatar(id: string) {
    const img = Images.findOne({ userId: id }, { meta: {} })
    return img ? img.link() : '/img/no_image_available.jpg'
  }
})