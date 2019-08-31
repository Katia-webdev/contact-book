//Contact Class
class Contact {
    constructor(firstName, surname, phoneNumber) {
        this.firstName = firstName;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
    }
}


// UI Class  (handles UI tasks)
class UI {
    static displayContacts() {
        const contacts = Store.getContacts();

        contacts.forEach((contact) => UI.addItemToList(contact));
    }

    static addItemToList(contact) {
        const list = document.getElementById('phoneList');

        const row = document.createElement('tr');
        row.innerHTML = ` 
                <td>${contact.firstName}</td>
                <td>${contact.surname}</td>
                <td>${contact.phoneNumber}</td>
                <td id="deleteBtn"><a href="" class="btn btn-danger btn-sm delete">Delete</a></td>
            `;

        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = ` alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.getElementById('phoneNumberForm');
        container.insertBefore(div, form);    // inserting div before the form

        //Disappear in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 1500);
    }

    static clearFields() {
        document.querySelector('#firstName').value = '';
        document.querySelector('#surname').value = '';
        document.querySelector('#phoneNumber').value = '';
    }

    static deleteItem(element) {
        if (element.classList.contains('delete')) {
            element.parentElement.parentElement.remove();
        }
    }
}


// Store Class for Storage
class Store {
    static getContacts() {
        let contacts;
        if(localStorage.getItem('contacts') === null){
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }

        return contacts;
    }

    static addContact(contact){
        const contacts = Store.getContacts();

        contacts.push(contact);
        
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(phoneNumber){
        const contacts = Store.getContacts();

        contacts.forEach((contact, index) => {
            if(contact.phoneNumber === phoneNumber){
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}


// Event : Displaying books
document.addEventListener('DOMContentLoaded', UI.displayContacts);


// Event: Adding

document.getElementById('phoneNumberForm').addEventListener('submit', (e) => {

    e.preventDefault();

    // getting form values
    const firstName = document.getElementById('firstName').value;
    const surname = document.getElementById('surname').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    //Validation 
    if (firstName === '' || surname === '' || phoneNumber === '') {
        UI.showAlert('Please fill in the form', 'danger');
    } else {
        //Instatiate book
        const contact = new Contact(firstName, surname, phoneNumber);

        // Adding contact to a list
        UI.addItemToList(contact);

        //Adding contact to store
        Store.addContact(contact);

        //Success message - added
        UI.showAlert('Contact added successfully', 'success');

        //Clear fields
        UI.clearFields();
    }


})


// Event : Deleting item 
document.getElementById('phoneList').addEventListener('click', (e) => {

    //Remove from UI
    UI.deleteItem(e.target);

    //Remove from storage
    Store.removeContact(e.target.parentElement.previousElementSibling.textContent);

    //Success message - removed
    UI.showAlert('Contact removed', 'warning');
})