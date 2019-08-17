import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

const OrdersPositions = {
  clients: { next: 'conveyor_1', prev: null },
  conveyor_1: { next: 'conveyor_2', prev: 'conveyor_1' },
  conveyor_2: { next: 'conveyor_3', prev: 'conveyor_1' },
  conveyor_3: { next: 'conveyor_4', prev: 'conveyor_2' },
  conveyor_4: { next: 'finish', prev: 'conveyor_3' }
};

const moveOrders = (arr, posToCompare, method, action) => {
  return arr.map(el => {
    if (el.id === action.payload) {
      return (el.position === posToCompare ||
              (el.position === Object.keys(OrdersPositions)[Object.keys(OrdersPositions).length-1] && el.ingredients.length === 0)) ?
        el :
        {...el, position: OrdersPositions[el.position][method]};
    } else {
      return el;
    }
  });
};

const PizzaReducer = (state = [], action) => {
  switch (action.type) {
    case(CREATE_NEW_ORDER): {
      return [
        ...state,
        {
          id: action.payload.id,
          ingredients: [],
          position: 'clients',
          recipe: action.payload.recipe
        }
      ];
    }
    case(MOVE_ORDER_NEXT): {
      return moveOrders(state, `finish`, `next`, action);
    }
    case(MOVE_ORDER_BACK): {
      return moveOrders(state, `clients`, `prev`, action);
    }
    case(ADD_INGREDIENT): {
      const newItem = action.payload.ingredient;

      const newState = state.map(el => {
        const ingredients = el.ingredients;
        return el.recipe.includes(newItem) ?
          {...el, ingredients: [...ingredients, newItem]} :
          el;
      });

      return newState;
    }
    default:
      return state;
  }
};


export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);

export default PizzaReducer;
