const Contact = require("../models/contactModels");

module.exports.addContact = async (req, res, next) => {
    const newContact = new Contact({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        userId: req.body.userId
    });

    newContact.save()
        .then(contact => {
            res.status(201).json({
                message: 'Contact added successfully',
                contact: contact
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Error adding contact',
                error: error
            });
        });
};

module.exports.getAllContacts = async(req,res,next) => {
    try{
        const userId = req.query.userId;
        const contacts = await Contact.find({userId});
        return res.json(contacts);
    } catch(ex){
        next(ex);
    }
}

module.exports.deleteContact = async (req, res,next) => {
    try {
      await Contact.deleteMany({ _id: { $in: req.body.ids } });
      res.status(200).json({ message: "Contacts deleted successfully" });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.editContact = async (req, res, next) => {
    try {
        const updatedContact = await Contact.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.status(200).json({ message: "Contact updated successfully", updatedContact });
      } catch (error) {
        res.status(500).json({ message: "Error updating contact", error });
      }
    
};
