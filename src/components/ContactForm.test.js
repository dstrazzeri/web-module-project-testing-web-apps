import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>)
    const header = screen.queryByText(/Contact Form/i);

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/First Name/i);
    userEvent.type(firstNameField, "abc");

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>)

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId('error');
        expect(errorMessages).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)

    const firstNameField = screen.getByLabelText(/first name*/i)
    userEvent.type(firstNameField, "danielle");

    const lastNameField = screen.getByLabelText(/last name*/i)
    userEvent.type(lastNameField, "strazzeri");

    const button = screen.getByRole("button");
    userEvent.click(button);

    const errorMessages = await screen.findAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)

    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, "dstrazzeri303@gmail");

    const errorMessage = await screen.findByText(/email must be a valid email address./)
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i)
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)

    const firstNameField = screen.getByLabelText(/first name*/i);
    const lastNameField = screen.getByLabelText(/last name*/i)
    const emailField = screen.getByLabelText(/email*/i)

    userEvent.type(firstNameField, "danielle")
    userEvent.type(lastNameField, "strazzeri")
    userEvent.type(emailField, "dstrazzeri303@gmail.com")

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("danielle");
        const lastNameDisplay = screen.queryByText("strazzeri");
        const emailDisplay = screen.queryByText("dstrazzeri303@gmail.com")
        const messageDisplay = screen.queryByTestId("messageDisplay")

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)

    const firstNameField = screen.getByLabelText(/first name*/i);
    const lastNameField = screen.getByLabelText(/last name*/i)
    const emailField = screen.getByLabelText(/email*/i)
    const messageDisplay = screen.getByLabelText(/message*/i)

    userEvent.type(firstNameField, "danielle")
    userEvent.type(lastNameField, "strazzeri")
    userEvent.type(emailField, "dstrazzeri303@gmail.com")
    userEvent.type(messageDisplay, "message")

    const submitButton = screen.getByRole("button")
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("danielle");
        const lastNameDisplay = screen.queryByText("strazzeri");
        const emailDisplay = screen.queryByText("dstrazzeri303@gmail.com")
        const messageDisplay = screen.queryByText("message")

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
});