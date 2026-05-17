import { Pagination, PaginationProps } from "antd"
import styles from './index.module.scss';

const TodoPagination: React.FC<PaginationProps> = props => {
    const { className = '', ...rest } = props;
    
    return (
            <Pagination
                className={`${styles.pagination} ${className}`}
                {...rest}
            />
    )
}

export default TodoPagination;