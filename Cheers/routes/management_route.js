const express = require('express');
const path = require('path');
const emailer = require('../db/emailer.js');
let userManager;
let ticketManager;
let showManager;

/**
 * This router handles any requests from the management page. Requests here
 * should be validated that they are coming from an admin account.
 *
 * @type {Router|router}
 */
let router = express.Router();

//GET http://127.0.0.1/manage -> Send ../html/management.html
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'html', 'managementTools.html'));
});

//Add user manager as a variable
router.setUserManager = function (manager) {
    userManager = manager;
};

//Add ticket manager as a variable
router.setTicketManager = function (manager) {
    ticketManager = manager;
};
//Add show manager as a variable
router.setShowManager = function (manager) {
    showManager = manager;
};

//GET http://127.0.0.1/manage/user?id=<id value>  ->  A json object containing either user or errors (a list of errors)
router.get('/user', function (req, res) {
    if (!req.query.id || req.query.id === "") {
        console.log("Id is required to get user");
        res.json({errors: ["User ID is required to get user"]})
    } else {
        let userId = req.query.id;
        userManager.getUser(userId, function (user) {
            if (user) {
                console.log(`Sending user of id ${userId}`);
                res.json({user: user});
            } else {
                let err = `User with id ${userId} not found`;
                console.log(err);
                res.json({errors: [err]})
            }
        });
    }
});

router.get('/users', function (req, res) {
    userManager.getUsers(function (users) {
        if (users) {
            res.json({users: users});
        } else {
            let err = `Users not found`;
            console.log(err);
            res.json({errors: [err]})
        }
    });
});

router.get('/ticket', function (req, res) {
    if (!req.query.id || req.query.id === "") {
        console.log("Id is required to get ticket");
        res.json({errors: ["Ticket ID is required to get ticket"]})
    } else {
        let ticketID = req.query.id;
        ticketManager.getTicket(ticketID, function (ticket) {
            if (ticket) {
                console.log(`Sending ticket of id ${ticketID}`);
                console.log(ticket);
                res.json({ticket: ticket});
            } else {
                let err = `ticket with id ${ticketID} not found`;
                console.log(err);
                res.json({errors: [err]})
            }
        });
    }
});

router.get('/tickets', function (req, res) {
    ticketManager.getTickets(function (tickets) {
        if (tickets) {
            res.json({tickets: tickets});
        } else {
            let err = `Tickets not found`;
            console.log(err);
            res.json({errors: [err]})
        }
    });
});

router.post('/user_add', function (req, res) {
    userManager.add_user(req.body.firstName, req.body.lastName, req.body.addressID, req.body.phoneNumber, req.body.email, req.body.ccn, req.body.accountLoginID, req.body.seasonTicketSeat, req.body.sthProductionID);
    res.send({});
});


router.post('/user_delete', function (req, res) {
    userManager.delete_user(req.body.userID);
    res.send({});
});

router.post('/user_update', function (req, res) {
    userManager.update_user(req.body.userID, req.body.firstName, req.body.lastName, req.body.addressID, req.body.phoneNumber, req.body.email, req.body.ccn, req.body.accountLoginID, req.body.seasonTicketSeat, req.body.sthProductionID);
    res.send({});
});

router.post('/user_update_sth_seat', function (req, res) {
    userManager.update_user_sth_seat(req.body.userID,  req.body.seasonTicketSeat, req.body.sthProductionID);
    res.send({});
});


router.post('/update_paid', function (req, res) {
    ticketManager.paid_update(req.body.ticketID);
    res.send({});
});

router.post('/notifyRenew', function (req, res) {
    userManager.getEmails(function (emails) {
        if (emails) {
            emailer.notify(emails);
        }
    });
    res.send({});
});

router.post('/show_update_setPrice', function (req, res) {
    showManager.updateShowPrice(req.body.showID,  req.body.floorPrice, req.body.balconyPrice);
    res.send({});
});

router.post('/ticketseat_update', function (req, res) {
    ticketManager.update_ticket_seat(req.body.ticketID, req.body.showID, req.body.seats, req.body.numSeats);
    res.send({});
});


module.exports = router;
