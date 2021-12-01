const createFilterItemTemplate = (filters) => {
  const {name, count} = filters;

  const allMoviesTemplate = () => `<a href="#all" class="main-navigation__item">${name}</a>`;

  return name === 'All movies' ?
    allMoviesTemplate() :
    `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`;
};

export const createMainNavTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
      <a href="#stats" class="main-navigation__additional main-navigation__additional--active">Stats</a>
  </nav>

  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};
