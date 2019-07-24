import React from 'react';
import {GlobalContextObject} from "../contexts/GlobalContext";
import Dialog from "../types/Dialog";
import {Link} from "react-router-dom";
import fetchData from "../utils/fetch-data";
import NewDialogForm from "../components/NewDialogForm";

interface Props {
  context: GlobalContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  errorMessage: string;
  dialogs: Dialog[];
}

export default class DialogListPage extends React.Component<Props, State> {

  state = {
    errorMessage: "",
    dialogs: [],
  };

  async componentDidMount() {
    await this.getAllDialogs();
  }

  getAllDialogs = async () => {

    const query = `
      query {
          dialogs {
            name
            id
          }
      }
    `;

    try {
      const dialogs = await fetchData(query, "dialogs", this.props.context);
      this.setState({
        dialogs
      });
    } catch(error) {
      this.setState({
        errorMessage: error.message,
      });
    }

  };

  addDialogToState = (dialog: Dialog) => {
    this.setState((previousState: State) => {
      return {
        dialogs: [...previousState.dialogs, dialog],
      };
    });
  };

  render() {
    return (
      <div>
        <h1>Dialogs</h1>
        <ul>
          {this.state.dialogs.map(
            (dialog: Dialog) => {
              return (
                <li key={dialog.id}>
                  <div>{dialog.name}</div>
                  <div>
                    <Link to={`${this.props.match.url}/${dialog.id}/choose-role`}>Practice</Link>&nbsp;|&nbsp;
                    <Link to={`${this.props.match.url}/${dialog.id}/edit`}>Edit</Link>
                  </div>
                </li>
              );
            })}
        </ul>
        <NewDialogForm getAllDialogs={this.getAllDialogs} addDialogToParentState={this.addDialogToState}/>
      </div>
    );
  }
}
