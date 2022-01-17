import { StatisticsType, userRank } from '../utils/const';
import { getDurationTime } from '../utils/date';
import { statisticFilter, getTopGenre, getTotalDuration, getGenres } from '../utils/statistic';
import { getUserRank } from '../utils/utils';
import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const ChartFeature = {
  TYPE: 'horizontalBar',
  BACKGROUND: '#ffe800',
  ANCHOR: 'start',
  BAR_THICKNESS: 24,
  SIZE: 20,
  COLOR: '#ffffff',
  ALIGN: 'start',
  OFFSET: 40,
  PADDING: 100,
};

const BAR_HEIGHT = 50;

const renderChart = (statisticCtx, films) => {
  const genresMap = getGenres(films);

  const sortedGenresMap = Object.keys(genresMap)
    .sort((a, b) => genresMap[b] - genresMap[a])
    .reduce((sortedObj, key) => ({
      ...sortedObj,
      [key]: genresMap[key]
    }), {});

  const genres = Object.keys(sortedGenresMap);
  const genresCounts = Object.values(sortedGenresMap);

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: ChartFeature.TYPE,
    data: {
      labels: genres,
      datasets: [{
        data: genresCounts,
        backgroundColor: ChartFeature.BACKGROUND,
        hoverBackgroundColor: ChartFeature.BACKGROUND,
        anchor: ChartFeature.ANCHOR,
        barThickness: ChartFeature.BAR_THICKNESS,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: ChartFeature.SIZE,
          },
          color: ChartFeature.COLOR,
          anchor: ChartFeature.ANCHOR,
          align: ChartFeature.ALIGN,
          offset: ChartFeature.OFFSET,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartFeature.COLOR,
            padding: ChartFeature.PADDING,
            fontSize: ChartFeature.SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

};

const createStatisticFilterItemTemplate = (filter, currentFilter) => {
  const {name, type} = filter;

  return `
    <input
    type="radio"
    class="statistic__filters-input visually-hidden"
    name="statistic-filter"
    id="statistic-${type}" value="${type}" ${type === currentFilter ? 'checked' : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${name}</label>
  `;
};

const createStatiisticTemplate = (watchedFilms, filteredFilms, filters, currentFilter) => {
  const statisticItemsTepmlate = filters.map((filter) => createStatisticFilterItemTemplate(filter, currentFilter)).join('');

  const rank = getUserRank(watchedFilms.length, userRank);
  const totalDuration = getDurationTime(getTotalDuration(filteredFilms), 'minute');
  const [hour, minute] = totalDuration.split(' ');
  const genre = getTopGenre(filteredFilms);

  return `<section class="statistic">

  ${rank !== 'None' ? `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>` : ''}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${statisticItemsTepmlate}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filteredFilms.length} <span class="statistic__item-description">${filteredFilms.length === 1 ? 'movie' : 'movies'}</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${parseInt(hour, 10)} <span class="statistic__item-description">h</span> ${parseInt(minute, 10)} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        ${filteredFilms.length === 0 ? '' : `
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${genre}</p>
        `}
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatisticView extends SmartView {
  #watchedFilms = null;
  #currentFilter = null;
  #chart = null;

  constructor(films) {
    super();

    this.#watchedFilms = films.filter((film) => film.userDetails.isAlreadyWatched);
    this.#currentFilter = StatisticsType.ALL;
    this._data = statisticFilter[this.#currentFilter](this.#watchedFilms);

    this.setFilterChangeHandler();
    this.#setCharts();
  }

  get template() {
    return createStatiisticTemplate(this.#watchedFilms, this._data, this.filters, this.#currentFilter);
  }

  get filters() {
    return [
      {
        type: StatisticsType.ALL,
        name: 'All time',
      },
      {
        type: StatisticsType.TODAY,
        name: 'Today',
      },
      {
        type: StatisticsType.WEEK,
        name: 'Week',
      },
      {
        type: StatisticsType.MONTH,
        name: 'Month',
      },
      {
        type: StatisticsType.YEAR,
        name: 'Year',
      },
    ];
  }

  restoreHandlers = () => {
    this.setFilterChangeHandler();
    this.#setCharts();
  }

  setFilterChangeHandler = () => {
    this.element.querySelector('.statistic__filters').addEventListener('change', this.#filterChangeHandler);
  }

  #setCharts = () => {
    if (this.#chart !== null) {
      this.#chart = null;
    }

    const chartContainer = this.element.querySelector('.statistic__chart');
    this.#chart = renderChart(chartContainer, this._data);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.name !== 'statistic-filter') {
      return;
    }

    this.#currentFilter = evt.target.value;
    this._data = statisticFilter[this.#currentFilter](this.#watchedFilms);
    this.updateElement();
  }
}
