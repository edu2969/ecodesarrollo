import {
	Meteor
} from 'meteor/meteor';

require('dotenv').config({
	path: Assets.absoluteFilePath('.env'),
});

Meteor.startup(() => {

});