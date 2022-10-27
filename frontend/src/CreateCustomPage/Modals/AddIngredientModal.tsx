import Modal from 'react-modal';
import './AddIngredientModal.scss'

export interface Ingredient {
    name: string;
}

interface IProps {
    isOpen: boolean;
    close: () => void;
    addedIngredientList: Ingredient[];
    setNewIngrdient: React.Dispatch<React.SetStateAction<string>>;
}

const AddIngredientModal = (props: IProps) => {
    const { isOpen, close, addedIngredientList, setNewIngrdient } = props;

    const dummyIngredients: Ingredient[] = [
        { name: "Kahlua" },
        { name: "Milk" },
    ];

    const onClickIngredient = (ingredient: Ingredient) => {
        setNewIngrdient(ingredient.name);
        close();
    };

    return (
        <Modal className="modal" isOpen={isOpen}>
            <div className="modal__ingredient-list">
                {dummyIngredients.map((ingredient) => {
                    const isAlreadyAdded = addedIngredientList.includes(ingredient);
                    return (
                        <button 
                            className='modal__ingredient'
                            onClick={() => onClickIngredient(ingredient)}
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