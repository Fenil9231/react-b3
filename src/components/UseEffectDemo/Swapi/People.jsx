import React from "react";
import Button from '../../Button';
import PropTypes from 'prop-types';
import './style.css';

export const People = () => {
  const [peopleId, setPeopleId] = React.useState(0);

  return (
    <div className="formContainer">

      {[0, 1, 2, 3, 4, 5,6,7,8,9,10,11,500].map((num) => (
        <Button
          onClick={() => {
            setPeopleId(num);
          }}
          variant={peopleId === num ? 'success' : 'normal' }
          key={num}
        >
          {num}
        </Button>
      ))}

      <PeopleDetails id={peopleId} />
    </div>
  );
}

const getAPICallInitialState = () => null;

const getAPICallLoadingState = () => ({
  isFetching: true,
  data: null,
  errorMessage: ""
});

const getAPICallErrorState = (errorMessage) => {
  // hey log this object and observe what functionalities you are getting
  return {
    isFetching: false,
    data: null,
    errorMessage,
  }
};

const getAPICallSuccessState = (data) => ({
  isFetching: false,
  data,
  errorMessage: ""
});

const PeopleDetails = ({ id }) => {
  const [reqState, setRequestState] = React.useState(getAPICallInitialState());

  React.useEffect(() => {
    if (!id) {
      setRequestState(getAPICallInitialState());
      return;
    }
    setRequestState(getAPICallLoadingState());
    fetch(`https://swapi.dev/api/people/${id}`)
      .then(res => {
        console.log('res in 1st then ', res);
        if(res.status >= 400) {
            throw `Something went wrong. Error code ${res.status}`;
        }
        const returnVal = res.json();
        return returnVal;
      })
      .then(res => {
        console.log('res in 2nd then ', res);
        return res;
      })
      .then(res => setRequestState(getAPICallSuccessState(res)))
      .catch(err => {
        let errMsg = '';
        console.log('err in catch block => ', err);
        if (typeof err === 'string') {
            errMsg = err;
        } else if (err && err.message && typeof err.message === 'string') {
            errMsg = err.message;
        } else {
            errMsg = 'Something went wrong !!'
        }
        setRequestState(getAPICallErrorState(errMsg))
      });

  }, [id]);

  let content = null;
  console.log(reqState);  

  if (!id) {
    content = <h2>{id} is invalid id.</h2>;
  } else if (reqState?.isFetching) {
    content = (<div>
            <Loader text={`Fetching data for id ${id}`}/>
        </div>);
  } else if (reqState?.errorMessage) {
    content = <Error message={reqState.errorMessage} />;
  } else if (reqState?.data) {
    content = <pre>{JSON.stringify(reqState.data, "", 2)}</pre>
  }
  return (
    <div>
      {id ? <h1>{id}</h1> : null}
      {content}
    </div>
  );
};

PeopleDetails.propTypes = {
    id: PropTypes.number.isRequired,
}

/*
    Copied directly from the house of W3School 😅
    https://www.w3schools.com/howto/howto_css_loader.asp 
*/
const Loader = ({ text }) => {
    return (<div>
        <div className="loader"></div>
        {text ? <div>{text}</div> : null }
    </div>);
}
Loader.propTypes = { text: PropTypes.string };

const Error = ({ message }) => {
  return (<div style={{ color: 'red', padding: '1rem' }}>
    <h3>{message}</h3>
  </div>);
}
Error.propTypes = { message: PropTypes.string }
Error.defaultProps = { message: 'Something went wrong' }