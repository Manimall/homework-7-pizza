import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

const OrdersPositions = {
  clients: { next: 'conveyor_1', prev: null },
  conveyor_1: { next: 'conveyor_2', prev: 'clients' },
  conveyor_2: { next: 'conveyor_3', prev: 'conveyor_1' },
  conveyor_3: { next: 'conveyor_4', prev: 'conveyor_2' },
  conveyor_4: { next: 'finish', prev: 'conveyor_3' }
};

const OrdersPositionsKeys = Object.keys(OrdersPositions);

const lastOrdersPosition = OrdersPositionsKeys[OrdersPositionsKeys.length-1];
const firstOrdersPosition = OrdersPositionsKeys[0];
const firstConveyorPosition = OrdersPositionsKeys[1];


const moveOrders = (arr, posToCompare, method, action) => {
  return arr.map(el => {
    if (el.id === action.payload) {
      return ((el.position === posToCompare && el.ingredients.length < el.recipe.length) ||
              (el.position === firstConveyorPosition && method === `prev`)) ?
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
          position: `clients`,
          recipe: action.payload.recipe
        }
      ];
    }
    case(MOVE_ORDER_NEXT): {
      return moveOrders(state, lastOrdersPosition, `next`, action);
    }
    case(MOVE_ORDER_BACK): {
      return moveOrders(state, firstOrdersPosition, `prev`, action);
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
