import ReactModal from 'react-modal';
import './AddIngredientModal.scss'

interface IProps {
    isOpen: boolean;
}

const AddIngredientModal = (props: IProps) => {
    const { isOpen } = props;

    return (
        <ReactModal isOpen={isOpen}>
            <div>Modal</div>
        </ReactModal>
    )
};

export default AddIngredientModal;