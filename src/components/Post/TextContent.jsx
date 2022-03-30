import { useState } from "react";
import styles from './TextContent.module.css'
  
const TextContent = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className={styles.text}>
      {isReadMore ? text?.slice(0, 150) : text}
      {text?.length > 150 && <span onClick={toggleReadMore} className={styles.readMore}>
        {isReadMore ? " ...read more" : " show less"}
      </span>}
    </p>
  );
};
  
// const Content = ({children}) => {
//   return (
//     <div className="container">
//       <h2>
//         <ReadMore>
//          {children}
//         </ReadMore>
//       </h2>
//     </div>
//   );
// };
  
export default TextContent;