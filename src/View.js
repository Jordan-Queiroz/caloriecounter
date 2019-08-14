import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { 
  showFormMsg,
  mealInputMsg,
  caloriesInputMsg,
  saveMealMsg,
  deleteMealMsg,
  editMealMsg,
} from './Update';

const { pre, div, h1, button, form, label, input, tbody, table, tr, td, th, thead, i } = hh(h);

function fieldSet(labelText, inputValue, oninput) {
  return div([
    label({ className: 'db mb1' }, labelText),
    input({
      className: 'pa2 input-reset ba w-100 mb2',
      type: 'text',
      value: inputValue,
      oninput
    }),
  ]);
}

function buttonSet(dispatch) {
  return div([
    button(
      {
        className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
        type: 'submit',
      },
      'Save',
    ),
    button(
      {
        className: 'f3 pv2 ph3 bn bg-light-gray dim',
        type: 'button',
        onclick: () => dispatch(showFormMsg(false)),
      },
      'Cancel',
    ),
  ]);
}

function formView(dispatch, model) {
  const { description, calories, showForm } = model;
  if (showForm) {
    return form(
      {
        className: 'w-100 mv2',
        onsubmit: e => {
          e.preventDefault();
          dispatch(saveMealMsg);
        },
      },
      [
        fieldSet('Meal', description,
          e => dispatch(mealInputMsg(e.target.value))
        ),
        fieldSet('Calories', calories || '',
          e => dispatch(caloriesInputMsg(e.target.value))
        ),
        buttonSet(dispatch),
      ],
    );
  }
  return button( 
      { 
        className: 'f3 pv2 ph3 bg-blue white bn',
        onclick: () => dispatch(showFormMsg(true)),
      },
      'Add Meal',
    );
}

function view(dispatch, model) {
  const header = mealHeader('')
  const total = totalRow('bt b', model.meals)

  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Calorie Counter'),
    formView(dispatch, model),
    
    mealsTable('mv2 w-100 callapse', header, total, model.meals, dispatch)
    // Pass model here to mount the table
    //pre(JSON.stringify(model, null, 2)),
  ]);
}

function mealsTable(className, header, total, meals, dispatch) {
  view = mealsBody('', meals, dispatch);

  if (meals.length === 0) {
    return div({className: 'mv2 i black-50'}, 'No meals to display...')
  }

 // view.appendChild(total);
  return table({className}, [
    header,
    view,
    total
  ]);
}

function mealsBody(className, meals, dispatch) {
  const rows = R.map(R.partial(mealRow, [dispatch, 'stripe-dark']), meals);
  return tbody({ className }, rows);
}

function mealRow(dispatch, className, meal) {
  return tr({ className }, [
    cell(td, 'pa2', meal.description),
    cell(td, 'pa2 tr', meal.calories),
    cell(td, 'pa2 tr', [
      i({
        className: 'ph1 fa fa-trash-o pointer',
        onclick: () => dispatch(deleteMealMsg(meal.id)),
      }),
      i({
        className: 'ph1 fa fa-pencil-square-o pointer',
        onclick: () => dispatch(editMealMsg(meal.id)),
      })
    ]),
  ]);
}

function cell(tag, className, value) { 
  return tag({className}, value);
}

function mealHeader(className) {
  const hr = tr({className}, [
    cell(th, "pa2 tl", 'Meal'),
    cell(th, "pa2 tr", 'Calories'),
    cell(th, '', '')
  ]);
  return thead({className}, hr);
}

function totalRow(className, meals) {
  const total = R.reduce(sum, {}, meals);
  
  return tr({ className }, [
    cell(td, 'pa2 tr', 'Total:'),
    cell(td, 'pa2 tr', total.acc),
    cell(td, '', '')
  ]);
}

function sum(acumalator, m2) {
  const {acc=0} = acumalator
  return {acc: acc + m2.calories};
}

export default view;