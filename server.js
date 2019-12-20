// server.js
// load the things we need
const express = require('express');
const app = express();
const fs = require('fs')

// set the view engine to ejs
app.set('view engine', 'ejs');

const artists = new Map()
const labels = new Map()
const labelsobject = require('./db/labels.json')

labelsobject.forEach(label => {
    labels.set(label.id, label)
})

console.log(labels)

fs.readdirSync(process.cwd() + '/db/artists').forEach(artist => {
    const artistobject = require('./db/artists/' + artist)
    const albums = artistobject.albums
    var artistfinal = {
        name: artistobject.name,
        id: artistobject.id,
        albums: new Map(),
        bio: artistobject.bio
    }
    albums.forEach(album => {
        var albumobject = {
            name: album.name,
            songs: new Map(),
            type: album.type,
            id: album.id
        }
        album.songs.forEach((song) => {
            song.label = labels.get(song.label)
            albumobject.songs.set(song.id, song)
        })
        artistfinal.albums.set(albumobject.id, albumobject)
    })
    artists.set(artistobject.id, artistfinal)
})
console.log(artists.get('fabianmazur').albums.get('sungoesdown'))

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// artists page
app.get('/artists', function(req, res) {
    res.render('pages/artists', {artists})
})

app.get('/artist/:id', function(req, res) {
    const artist = artists.get(req.params.id)
    console.log(artist)
    res.render('pages/artist', {artist})
})

app.get('/artist/:arid/album/:alid', function(req, res) {
    const artist = artists.get(req.params.arid)
    const album = artist.albums.get(req.params.alid)
    res.render('pages/album', {artist,album})
})

app.get('/artist/:arid/album/:alid/song/:sid', function(req, res) {
    const artist = artists.get(req.params.arid)
    const album = artist.albums.get(req.params.alid)
    const song = album.songs.get(req.params.sid)
    res.render('pages/song', {artist,album,song})
})

app.listen(8080);
console.log('8080 is the magic port');