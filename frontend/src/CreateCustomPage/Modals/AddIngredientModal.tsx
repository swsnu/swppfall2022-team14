import Modal from 'react-modal';
import './AddIngredientModal.scss'

interface Ingredient {
    name: string;
}

interface IProps {
    isOpen: boolean;
    close: () => void;
    addedIngredientList: Ingredient[];
}

const AddIngredientModal = (props: IProps) => {
    const { isOpen, close, addedIngredientList } = props;

    const dummyIngredients: Ingredient[] = [
        { name: "Kahlua" },
        { name: "Milk" },
    ];

    return (
        <Modal className="modal" isOpen={isOpen}>
            <div className="modal__ingredient-list">
                {dummyIngredients.map((ingredient) => {
                    const isAlreadyAdded = addedIngredientList.includes(ingredient);
                    return (
                        <button 
                            className='modal__ingredient'
                            disabled={isAlreadyAdded}
                        >
                            {ingredient.name}
                        </button>
                    )
                })}
            </div>
            <button className='modal__close-button' onClick={close}>Close</button>
        </Modal>
    )
};

export default AddIngredientModal;