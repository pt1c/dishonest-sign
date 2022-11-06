import './css/style.scss'
import * as bootstrap from 'bootstrap'

import MainPresenter from './presenter/main-presenter';

const mainContainer: HTMLElement = document.querySelector('.main');

const mainPresenter = new MainPresenter(mainContainer);
mainPresenter.init();
