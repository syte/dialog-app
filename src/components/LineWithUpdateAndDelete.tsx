import React, {ChangeEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";
import LineData from "../types/LineData";

interface Props {
  line: LineData;
}

const updateLineQuery =
  `
    mutation UpdateLine($id: String!, $text: String, $roleId: String, $number: Int) {
      updateLine(id: $id, text: $text, roleId: $roleId, number: $number) {
        id
        text
        number
      }
    }
  `;

const deleteLineQuery =
  `
    mutation DeleteLine($id: String!) {
      deleteLine(id: $id)
    }
  `;

export const LineWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [text, setText] = useState(props.line.text);
  // const [roleId, setRoleId] = useState(props.line.role.id);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const updateLine = async (queryVariables: {
      id: string;
      text?: string;
      roleId?: string;
      number?: number;
    }): Promise<void> => {

    try {
      await fetchData(updateLineQuery, queryVariables, "updateLine", context);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  const deleteLine = async (): Promise<void> =>  {

    const queryVariables = {
      id: props.line.id,
    };

    try {
      const deletionWasSuccessful: boolean = await fetchData(
        deleteLineQuery, queryVariables, "deleteLine", context
      );

      if(deletionWasSuccessful) {
        setIsDeleted(true);
      } else {
        setErrorMessage(`There was a problem when attempting to delete the Line with id ${props.line.id}` +
          `and text ${text}`);
      }
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  if (isDeleted) {
    return null;
  } else {
    return (
      <li>
        <form>
          <input
            type={"text"}
            value={text}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
            onBlur={async () => {
              await updateLine({
                id: props.line.id,
                text
              });
            }}
          />
          <button
            type={"button"}
            onClick={async () => {
              await deleteLine();
            }}
          >
            Delete Line
          </button>
        </form>
        {errorMessage ? <p>{errorMessage}</p> : null}
      </li>
    );
  }
};
