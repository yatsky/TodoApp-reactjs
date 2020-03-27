import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label,
    FormText
} from "reactstrap";

// create a 
export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // we want an activeItem for the modal
            activeItem: this.props.activeItem
        };
    }
    // handle change
    // e is the event
    handleChange = e => {
        // The target property of the Event interface is a reference to the object that dispatched the event.
        // Get the name and value of the event.target
        let { name, value } = e.target;
        if (e.target.type === "checkbox") {
            value = e.target.checked;
        }
        // [] lets us query object key names programmatically
        // in this case, [name] could be one of "title" and "description"
        // if we do not use [], then activeItem would be come {title:"", description: "", completed: false}
        // if we use [], one of title and description will be replaced by [name]:value
        const activeItem = { ...this.state.activeItem, [name]: value };
        // we need to save this interim activeItem in the modal so that we can save it later
        // if we want to
        this.setState({ activeItem });
    };
    render() {
        const { toggle, onSave } = this.props;
        return (
                <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}> Todo Item </ModalHeader>
                <ModalBody>
                <Form>
                    <FormGroup>
                    <Label for="title">Title</Label>
                    <Input
                        type="text"
                        name="title"
                        value={this.state.activeItem.title}
                        onChange={this.handleChange}
                        placeholder="Enter Todo Title"
                    />
                    </FormGroup>
                    <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                        type="text"
                        name="description"
                        value={this.state.activeItem.description}
                        onChange={this.handleChange}
                        placeholder="Enter Todo description"
                    />
                <FormText color="muted">
                Leave it short
            </FormText>
                    </FormGroup>
                <FormGroup check>
                <Label for="completed">
                <Input
            type="checkbox"
            name="completed"
            checked={this.state.activeItem.completed}
            onChange={this.handleChange}
                />
                Completed
            </Label>
                </FormGroup>
                </Form>
                </ModalBody>
                <ModalFooter>
                <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                Save
            </Button>
                </ModalFooter>
                </Modal>
        );
    }
}
