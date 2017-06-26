import React from 'react';
import ReactDOM from 'react-dom';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'tether/dist/js/tether';
import 'bootstrap/dist/js/bootstrap';

// Mock bank statement data.
const TRANSACTIONS = [
  { id: 1, date: '2017-10-10', description: 'ATM', withdrawls: 500.00, categories: ['Services'] },
  { id: 2, date: '2017-10-11', description: 'Puppy Brewery', withdrawls: 30.00, categories: ['Entertainment'] },
  { id: 3, date: '2017-10-12', description: 'Direct Deposit', deposits: 1000.00, categories: ['Services'] },
  { id: 4, date: '2017-10-13', description: 'Puppy Philz Coffee', withdrawls: 18.00, categories: ['Entertainment'] },
  { id: 5, date: '2017-10-13', description: 'Puppy Gelato Shoppe', withdrawls: 10.00, categories: ['Groceries'] },
  { id: 6, date: '2017-10-14', description: 'ATM', withdrawls: 60.00, categories: ['Services'] },
  { id: 7, date: '2017-10-15', description: 'Puppy Care Shoppe', withdrawls: 45.00, categories: ['Merchandise'] },
];

/**
* Class represents LineItemCategory component.
* This classes responsibility is to manage the state and rendering of the category list.
*/
class LineItemCategory extends React.Component {
  constructor(props) {
    // Must call do not forget.
    // https://facebook.github.io/react/docs/react-component.html#constructor
    super(props);
    this.state = {
      newCategory: '',
    };
  }

  handleOnSubmit(e) {
    e.preventDefault();
    if (this.state.newCategory) {
      this.props.onCategoryChange(this.state.newCategory, this.props.categoryItems.lineItemId);
    }
  }

  handleOnChange(e) {
    this.setState({ newCategory: e.target.value });
  }

  // Render categories and category input form.
  render() {
    const listItems = [];
    if (this.props.categoryItems) {
      _.forEach(this.props.categoryItems.categories, (item, index) => {
        listItems.push(<li key={index} >{item}</li>);
      });
    }
    let addNewCategoryInput = null;
    if (this.props.categoryItems) {
      addNewCategoryInput =
        (<form className="form-inline" onSubmit={e => this.handleOnSubmit(e)}>
          <div className="input-group">
            <input type="text" className="form-control" value={this.state.newCategory} placeholder="New Category..." onChange={e => this.handleOnChange(e)} />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-success">Add</button>
            </span>
          </div>
        </form>);
    }
    return (
      <div>
        <ul className="">
          {listItems}
        </ul>
        {addNewCategoryInput}
      </div>
    );
  }
}
LineItemCategory.defaultProps = {
  categoryItems: null,
  onCategoryChange: null,
};

LineItemCategory.propTypes = {
  categoryItems: T.object,
  onCategoryChange: T.func,
};

// Stateless function that renders line item row.
const LineItemRow = props => (
  <tr className={props.rowColor}>
    <td>{props.date}</td>
    <td>{props.description}</td>
    <td>
      <LineItemCategory
        categoryItems={props.category}
        onCategoryChange={props.onCategoryChange}
      />
    </td>
    <td>{props.withdrawls}</td>
    <td>{props.deposits}</td>
    <td>{props.balance}</td>
  </tr>
  );

LineItemRow.defaultProps = {
  date: null,
  description: null,
  category: null,
  withdrawls: null,
  deposits: null,
  balance: null,
  rowColor: null,
  onCategoryChange: null,
};

LineItemRow.propTypes = {
  date: T.string,
  description: T.string,
  category: T.object,
  withdrawls: T.number,
  deposits: T.number,
  balance: T.number,
  rowColor: T.string,
  onCategoryChange: T.func,
};


/**
* Class represents LineItemTable component.
* This classes responsibility is to manage the LintItemRow state and
* rendering the bank statement table.
*/
// eslint-disable-next-line
class LineItemTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { transactions: this.props.transactions };
    this.onCategoryChange = this.onCategoryChange.bind(this);
  }

  onCategoryChange(category, lineItemId) {
    const newState = [...this.state.transactions];
    _.find(newState, ['id', lineItemId]).categories.push(category);
    this.setState({ transactions: newState });
  }
  renderLineItemRows() {
    let sum = this.props.prevBalance;
    let sumWithdraws = 0;
    let sumDeposits = 0;
    let key = 0;
    const rows = [];

    // Create header line item row.
    rows.push(
      <LineItemRow
        rowColor={'table-warning'}
        key={key}
        description={'Previous Balance'}
        balance={this.props.prevBalance}
      />);

      // Create line item rows from statement transactions.
    _.forEach(this.props.transactions, (item) => {
      if (item.deposits) {
        sum += item.deposits;
        sumDeposits += item.deposits;
      }
      if (item.withdrawls) {
        sum -= item.withdrawls;
        sumWithdraws += item.withdrawls;
      }
      key += 1;
      rows.push(
        <LineItemRow
          rowColor={key % 2 === 0 ? 'table-warning' : ''}
          key={key}
          date={item.date}
          description={item.description}
          category={{ categories: item.categories, lineItemId: item.id }}
          withdrawls={item.withdrawls}
          deposits={item.deposits}
          balance={sum}
          onCategoryChange={this.onCategoryChange}
        />);
    });
    rows.push(<LineItemRow key={key + 1} />);
    rows.push(
      <LineItemRow
        rowColor={'table-active'}
        key={key + 2}
        description={'**TOTAL**'}
        withdrawls={sumWithdraws}
        deposits={sumDeposits}
      />);

    return rows;
  }
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="table-info">Date</th>
            <th className="table-info">Description</th>
            <th className="table-info">Category</th>
            <th className="table-info">Withdrawls</th>
            <th className="table-info">Deposits</th>
            <th className="table-info">Balance</th>
          </tr>
        </thead>
        <tbody>
          {this.renderLineItemRows()}
        </tbody>
      </table>
    );
  }
}

LineItemTable.defaultProps = {
  transactions: null,
  prevBalance: null,
};

LineItemTable.propTypes = {
  transactions: T.arrayOf(T.object),
  prevBalance: T.number,
};

// Stateless app component responsible for rendering App layout.
const App = props => (
  <div>
    <nav className="navbar navbar-toggleable-md navbar-light bg-faded navbar-fixed-top">
      <div className="navbar-brand">Bank of Scruffles</div>
    </nav>
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="font-weight-bold">Mister Scruffles</div>
          <div className="font-weight-bold">1234 Puppy Lane</div>
          <div className="font-weight-bold">Puppy Park, CA 94107</div>
        </div>
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th className="table-info">Statement Period</th>
                <th className="table-info">Account Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2017-10-10 to 2017-11-10</td>
                <td>00005-23-4561-2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <LineItemTable transactions={props.transactions} prevBalance={props.prevBalance} />
        </div>
      </div>
    </div>
  </div>
);

App.defaultProps = {
  transactions: null,
  prevBalance: null,
};

App.propTypes = {
  transactions: T.arrayOf(T.object),
  prevBalance: T.number,
};

ReactDOM.render(<App transactions={TRANSACTIONS} prevBalance={5000.00} />, document.getElementById('app'));
