import { useRef } from "react";


const MessageInput = ({submitMessageHandler}) => {

    const inputBox = useRef()

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(inputBox.current.value)
        submitMessageHandler(`${inputBox.current.value}`)
        inputBox.current.value = ''
      };
    
      return (
        <div >
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              maxLength="500"
              minLength="1"
              placeholder="Enter your message..."
            //   onChange={handleChange}
            //   value={inputBox}
              ref={inputBox}
            />
          </form>
          <button type="submit" onClick={handleSubmit}>Submit</button>
        </div>
      );
    };
  




export default MessageInput