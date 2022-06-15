import { ObjectId } from 'mongodb';
import { collection } from '../app.js';

export const getEvents = async (req, res) => {
  if (req.query.id) {
    if (ObjectId.isValid(req.query.id)) {
      collection
        .findOne({ _id: ObjectId(req.query.id) })
        .then((doc) => {
          res.status(200).json(doc);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    } else {
      res.status(500).json({ error: 'Not a valid ID' });
    }
  } else {
    const type = req.query.type
    const page = (req.query.page ? req.query.page - 1: 0)
    const limit = req.query.limit
    console.log(type, page, limit)
    let events = [];

    let sort = undefined
    if(req.query.type === 'latest'){
      sort = { '_id': -1 }
    } else {
      sort = { '_id': 1 }
    }

    collection
      .find()
      .sort(sort)
      .skip(parseInt(page) * parseInt(limit))
      .limit(parseInt(limit))
      .forEach((event) => events.push(event))
      .then(() => {
        res.status(200).json(events);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
};

export const createEvent = async (req, res) => {
  const event = req.body;

  function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
 }

  if(req.body.schedule){
    const timestamp = toTimestamp(req.body.schedule)
    event.schedule = timestamp
  }

  collection
    .insert(event)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

export const updateEvent = async (req, res) => {
  const event = req.body;
  if (ObjectId.isValid(req.params.id)) {
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: event,
        }
      )
      .then(() => {
        res.status(200).json('Event has been Updated');
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(500).json({ error: 'Not a valid ID' });
  }
};

export const deleteEvent = async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    collection
      .deleteOne({ _id: ObjectId(id) })
      .then(() => {
        res.status(200).json('Event has been Deleted');
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(500).json({ error: 'Not a valid ID' });
  }
};
