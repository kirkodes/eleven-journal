const Express = require("express"); // importing Express framework, stored inside variable. This becomes my gateway to using express methods
const router = Express.Router(); // new variable called router, that uses the Express variable which gives me access to the Router() method. This method will return a router object for me
let validateJWT = require("../middleware/validate-jwt");
const { JournalModel } = require("../models");

router.get('/practice', validateJWT, (req, res) => { // using the router object here by using the router variable to get access into the Router() object methods. the .get() is a method in the object; its called to complete an HTTP GET request. .get() takes in 2 arguments. 1st argument is the path /practice; 2nd argument is an anonymous function AKA the "handler function". The application "listens" for requests that match the specified routes (/practice) and methods
    res.send('Hey!! This is a practice route!') // .send() is an express method that can be called on the res (response object). My response parameter is a simple string
});

/*
===================
Journal Create
===================
*/
router.post("/create", validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const { id } = req.user;
    const journalEntry = {
        title,
        date,
        entry,
        owner: id
    }
    try {
        const newJournal = await JournalModel.create(journalEntry);
        res.status(200).json(newJournal);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    JournalModel.create(journalEntry)
});

/*
===================
Get all Journals
===================
*/
router.get("/", async (req, res) => {
    try {
        const entries = await JournalModel.findAll(); // findAll() is a sequelize method to find all of the items. this method returns a promise which we await the response of
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
===================
Get Journals by User
===================
*/
router.get("/mine", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userJournals = await JournalModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userJournals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
===================
Get Journals by Title
===================
*/
router.get("/title", async (req, res) => {
    const { title } = req.params;
    try {
        const results = await JournalModel.findAll({
            where: { title: title }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
===================
Update a Journal
===================
*/
router.put("/update/:entryId", validateJWT, async (req, res) => { // PUT replaces whatever is there with what we give it; put means to update
    const { title, date, entry } = req.body.journal;
    const journalId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            title: title,
            date: date,
            entry: entry
        }
    };

    try {
        const update = await JournalModel.update(updatedJournal, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
===================
Delete a Journal
===================
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const journalId = req.params.id;

    try {
        const query = {
            where: {
                id: journalId,
                owner: ownerId
            }
        };
        await JournalModel.destroy(query);
        res.status(200).json({ message: "Journal Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/about', (req, res) => {
    res.send("This is the about route!")
});

module.exports = router; // export the module for usage outside the file