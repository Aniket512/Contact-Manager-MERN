import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Button } from "@material-ui/core";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    TextField,
    Checkbox,
    Typography,
    AppBar,
    Toolbar,
} from '@mui/material';


export default function Home() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([]);
    const [contacts, setContacts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCheckboxClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const addContact = async (e) => {
        e.preventDefault();
        try {
            const existingContact = contacts.filter(contact => contact.name === name);

            if (existingContact.length) {
                await axios.put(`sapi/contacts/${existingContact[0]._id}`, { name, phone, email, userId });
            } else {
                await axios.post('https://contact-manager-mern-52h5.onrender.com/api/contacts', { name, phone, email, userId });
            }
            const response = await axios.get(`https://contact-manager-mern-52h5.onrender.com/api/contacts?userId=${userId}`);
            setContacts(response.data);
            setOpen(false);
            setName('');
            setPhone('');
            setEmail('');


        } catch (error) {
            console.error(error);
        }
    };

    const deleteContacts = async () => {
        try {
            await axios.delete("https://contact-manager-mern-52h5.onrender.com/api/contacts", { data: { ids: selected } });
            setContacts(prevContacts => prevContacts.filter(contact => !selected.includes(contact._id)));
            setSelected([]);
        } catch (error) {
            console.log(error.response.data.message);
        }
    };


    useEffect(() => {
        const verifyUser = async () => {
            if (!cookies.jwt) {
                navigate("/login");
            } else {
                const { data } = await axios.post(
                    "https://contact-manager-mern-52h5.onrender.com/api",
                    {},
                    {
                        withCredentials: true,
                    }
                );
                if (!data.status) {
                    removeCookie("jwt");
                    navigate("/login");
                }
            }
        };
        verifyUser();
    }, [cookies, navigate, removeCookie]);

    useEffect(() => {
        const getContacts = async () => {
            try {
                const response = await axios.get(`https://contact-manager-mern-52h5.onrender.com/api/contacts?userId=${userId}`)
                setContacts(response.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getContacts();
    }, [userId])

    const logOut = () => {
        removeCookie("jwt");
        navigate("/login");
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Contact List</Typography>
                    <Button style={{ marginLeft: "50px" }} variant="contained" color="secondary" onClick={logOut}>
                        Logout
                    </Button>

                </Toolbar>
            </AppBar>
            <Button style={{ margin: "0px 30px" }} variant="contained" color="primary" onClick={handleClickOpen}>
                Add to Contacts

            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Contact</DialogTitle>
                <form onSubmit={addContact}>
                    <DialogContent>
                        <TextField required style={{ marginBottom: "30px" }} label="Name" variant="outlined" fullWidth value={name} onChange={e => setName(e.target.value)} />
                        <TextField required style={{ marginBottom: "30px" }} label="Phone" variant="outlined" fullWidth value={phone} onChange={e => setPhone(e.target.value)} />
                        <TextField required label="Email" variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" color="primary">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Button style={{ margin: "20px 0px" }} variant="contained" color="secondary" onClick={deleteContacts}>
                Delete
            </Button>

            <div style={{marginLeft:"auto", marginRight:"auto", width:"95%"}}>
                <Paper >
                    <Table aria-label="simple table">
                        <TableHead style={{backgroundColor:"#C5C5C5"}}>
                            <TableRow >
                                <TableCell padding="checkbox"></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Phone</TableCell>
                                <TableCell align="left">Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contacts.map((contact, index) => (
                                <TableRow key={contact._id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selected.indexOf(contact._id) !== -1}
                                            onClick={event => handleCheckboxClick(event, contact._id)}
                                        />
                                    </TableCell>

                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="left">{contact.name}</TableCell>
                                    <TableCell align="left">{contact.phone}</TableCell>
                                    <TableCell align="left">{contact.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

            </div>

        </div>
    );
}
