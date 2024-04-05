// import "./pagination.scss";
// import LeftArrow from "../assets/img/LeftArrow.png";
// import RightArrow from "../assets/img/RightArrow.png";

// export default function Pagination() {
//   return (
//     <div className="paginationSec">
//       <ul id="pagination">
//         <li>
//           <img src={LeftArrow} alt="" />
//         </li>
//         <li>
//           <a href="./">1</a>
//         </li>
//         <li>
//           <a href="./" className="active">
//             2
//           </a>
//         </li>
//         <li>
//           <a href="./">3</a>
//         </li>
//         <li>
//           <a href="./">4</a>
//         </li>
//         <img src={RightArrow} alt="" />
//       </ul>
//     </div>
//   );
// }

import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import "./pagination.scss";

function Pagination(props) {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;
  const { paginationRange } = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const paginationHandler = (currentPage, pageSize, total) => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    return `${startItem} - ${endItem} of ${total} items`;
  };

  if (currentPage === 0 || paginationRange.length < 1) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div className="paginationSec">
      <div>&nbsp;</div>
      <div>
        <ul
          className={classnames("pagination-container", {
            [className]: className,
          })}
        >
          {/* eslint-disable-next-line */}
          <li
            className={classnames("pagination-item", {
              disabled: currentPage === 1,
            })}
            onClick={onPrevious}
          >
            <div className="arrow left" />
          </li>
          {paginationRange?.map((pageNumber, ind) => {
            if (pageNumber === DOTS) {
              return <li className="pagination-item dots">&#8230;</li>;
            }

            return (
              /* eslint-disable-next-line */
              <li
                key={ind}
                className={classnames("pagination-item", {
                  selected: pageNumber === currentPage,
                })}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </li>
            );
          })}
          {/* eslint-disable-next-line */}
          <li
            className={classnames("pagination-item", {
              disabled: currentPage === lastPage,
            })}
            onClick={onNext}
          >
            <div className="arrow right" />
          </li>
        </ul>
      </div>
      <div className="paginationCount">
        <span>{paginationHandler(currentPage, pageSize, totalCount)}</span>
      </div>
    </div>
  );
}

export default Pagination;
