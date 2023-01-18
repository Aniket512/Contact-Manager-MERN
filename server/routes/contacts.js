const {
    getAllContacts,
    addContact,
    deleteContact,
    editContact
} = require("../controllers/contactController");

const router = require("express").Router();

router.get("/contacts", getAllContacts);
router.post("/contacts", addContact);
router.delete("/contacts", deleteContact);
router.put("/contacts/:id", editContact);

module.exports = router;
