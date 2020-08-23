/* eslint "react/prefer-stateless-function": "off" */
import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, Row, Col,
} from 'react-bootstrap';

class CourseFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      semester: params.get('semester') || '',
      changed: false,
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    this.setState({ semester: e.target.value, changed: true });
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      semester: params.get('semester') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { semester } = this.state;
    const { history } = this.props;
    const params = new URLSearchParams();
    if (semester) params.set('semester', semester);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: '/courses', search });
  }

  render() {
    const { semester, changed } = this.state;
    return (
      <Row>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel>Semester:</ControlLabel>
            <FormControl
              componentClass="select"
              value={semester}
              onChange={this.onChangeStatus}
            >
              <option value="">(All)</option>
              <option value="Spring 2020">Spring 2020</option>
              <option value="Summer 2020">Summer 2020</option>
              <option value="Fall 2020">Fall 2020</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={12}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
                Apply
              </Button>
              <Button
                type="button"
                onClick={this.showOriginalFilter}
                disabled={!changed}
              >
                Reset
              </Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

export default withRouter(CourseFilter);
