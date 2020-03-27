import React, { Component } from "react";
// CustomModal is the default exported class from Modal.js
// Here we just quickly renamed it to Modal
import Modal from "./components/Modal";
import axios from "axios";

// Create an App component
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Disable completed tab
            viewCompleted: false,
            activeItem: {
                title: "",
                description: "",
                completed: false
            },
            // List of Todo items to be filled by axios
            todoList: [],
            modal: false
        };
    }
    componentDidMount() {
        // if this App did mount, then call the refreshList function
        this.refreshList();
    }
    // Fetch todo list from server/backend using axios
    refreshList = () => {
        axios
        // using Get
            .get("http://localhost:8000/api/todos/")
        // Feed the fetched json data to todoList
            .then(res => this.setState({ todoList: res.data }))
        // catch and print errors in console
            .catch(err => console.log(err));
    };

    // toggle display compeleted tasks
    // needs one status argument
    displayCompleted = status => {
        if (status) {
            return this.setState({ viewCompleted: true });
        }
        return this.setState({ viewCompleted: false });
    };

    // function responsible for rendering the tab
    // containing "complete" and "incomplete" tabs
    renderTabList = () => {
        return (
            <div className="my-5 tab-list">
              <span
                onClick={() => this.displayCompleted(true)}
                className={this.state.viewCompleted ? "active" : ""}
              >
                complete
              </span>
              <span
                onClick={() => this.displayCompleted(false)}
                className={this.state.viewCompleted ? "" : "active"}
              >
                Incomplete
              </span>
            </div>
        );
    };

    // function responsible for rendering items
    // when a tab is selected
    renderItems = () => {
        // use {} to destructure this.state equivalent to
        // viewCompleted =this.state.viewCompleted;
        const { viewCompleted } = this.state;
        // items to be displayed
        const newItems = this.state.todoList.filter(
            item => item.completed === viewCompleted
        );

        // for each item
        // create an li element for it
        // item here is the item from the json object provided by axios/backend
        return newItems.map(item => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span
                className={`todo-title mr-2 ${
                this.state.viewCompleted ? "completed-todo" : ""
              }`}
                title={item.description}
              >
                {item.title}
              </span>
              <span>
                <button
                  onClick={() => this.editItem(item)}
                  className="btn btn-secondary mr-2"
                >
                  {" "}
                  Edit{" "}
                </button>
                <button
                  onClick={() => this.handleDelete(item)}
                  className="btn btn-danger"
                >
                  Delete{" "}
                </button>
              </span>
            </li>
        ));
    };

    // toggle modal display
    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    // handle submit invoked by clicking Edit button
    // and by clicking the Save button on the modal
    handleSubmit = item => {
        // display modal for editing
        this.toggle();
        // if this operation is Edit
        if (item.id) {
            axios
            // put the item object in the database
            // put is idempotent so that running this multiple times will result in the outcome
                .put(`http://localhost:8000/api/todos/${item.id}/`, item)
            // refresh after we receive the response from backend
                .then(res => this.refreshList());
            // terminate the function
            return;
        }
        // if this operation is Save
        // post will create n new items if clicked n times
        axios
            .post("http://localhost:8000/api/todos/", item)
            .then(res => this.refreshList());
    };
    // handles delete when clicking the delete button
    handleDelete = item => {
        axios
        // delete the item in the backend
            .delete(`http://localhost:8000/api/todos/${item.id}`)
        // refresh the list after receiving the response from backend
            .then(res => this.refreshList());
    };

    // handle creating one item
    createItem = () => {
        // a new item to be filled
        const item = { title: "", description: "", completed: false };
        // set activeItem to the current empty item
        // set the activeItem for modal and display modal
        this.setState({ activeItem: item, modal: !this.state.modal });
    };
    // handle editing an item
    editItem = item => {
        // set the activeItem for modal and display modal
        this.setState({ activeItem: item, modal: !this.state.modal });
    };
    render() {
        return (
            <main className="content">
              <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
              <div className="row ">
                <div className="col-md-6 col-sm-10 mx-auto p-0">
                  <div className="card p-3">
                    <div className="">
                      <button onClick={this.createItem} className="btn btn-primary">
                        Add task
                      </button>
                    </div>
                    {this.renderTabList()}
                    <ul className="list-group list-group-flush">
                      {this.renderItems()}
                    </ul>
                  </div>
                </div>
              </div>
              {this.state.modal ? (
                  <Modal
                    activeItem={this.state.activeItem}
                    toggle={this.toggle}
                    onSave={this.handleSubmit}
                  />
              ) : null}
            </main>
        );
    }
}
export default App;

