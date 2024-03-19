const model = require('../models/story');

exports.index = (req, res) => {
    model.find()
    .then(stories=>res.render('./story/index',{stories}))
    .catch(err => next(err));
    
};

exports.new = (req, res) => {
    res.render('./story/new');
};

exports.create = (req, res) => {
    let story = req.body;
    story.createdAt = new Date();
    model.save(story)
    .then(result => res.redirect('/stories'))
    .catch(err => next(err));
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(story => {
        if(story){
            res.render('./story/show',{story});
        }else{
            let err = new Error('Cannot find story with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));

};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(story => {
        if(story){
            res.render('./story/edit',{story});
        }else{
            let err = new Error('Cannot find story with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let id = req.params.id;
    let story = req.body;
    model.updateById(id, story)
    .then(result => {
        if(result.lastErrorObject.updatedExisting){
            res.redirect('/stories/'+id);
        }else{
            let err = new Error('Cannot find story with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.deleteById(id)
    .then(result => {
        if(result.deletedCount === 1){
            res.redirect('/stories');
        }else{
            let err = new Error('Cannot find story with id '+id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};