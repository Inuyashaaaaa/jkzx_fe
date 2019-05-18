import * as d3Scale from 'd3-scale';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import Input from '../../Form/Input';
import { normalizeInput } from '../normalize';
import { IInputCellRendererParams, IInputCellRendererValue } from '../types';
import './HeatmapCellRenderer.less';

export class HeatmapCellRenderer extends PureComponent<IInputCellRendererParams> {
  // private eContainer: HTMLElement;

  // private eDelta: HTMLElement;

  // private eValue: HTMLElement;

  private static caches = {};

  private static backgroundCaches = {};

  private static colorCaches = {};

  private percent = 0.1;

  private max: number;

  private min: number;

  private background: string;

  private color: string;

  private scale: d3Scale.ScaleLinear<string, any>;

  constructor(props) {
    super(props);

    const lastValue = this.getLastValue();

    if (!lastValue || lastValue === this.getNormalValue()) return;

    this.min = lastValue - lastValue * this.percent;

    this.max = lastValue * this.percent + lastValue;

    const step = (this.max - this.min) / 3;

    this.scale = d3Scale
      .scaleLinear<string, any>()
      .domain([this.min, this.min + step, this.min + step * 2, this.max])
      .range(['green', 'yellow', 'orange', 'red'])
      .clamp(true);
  }

  public componentDidMount = () => {
    const id = this.getUnionCellId();
    HeatmapCellRenderer.caches[id] = this.getNormalValue();
    HeatmapCellRenderer.backgroundCaches[id] = this.background;
    HeatmapCellRenderer.colorCaches[id] = this.color;
    // this.eContainer = this.getItemDom('tongyu-cell-container');
    // this.eDelta = this.getItemDom('tongyu-cell-delta');
    // this.eValue = this.getItemDom('tongyu-cell-value');
    // this.refresh(this.props);
  };

  public refresh() {
    return false;
  }

  public render() {
    const value = this.getNormalValue();

    if (!_.isNumber(value)) {
      return this.getGui();
    }

    this.background = this.getHeatColor(value) || this.getLastBackground();
    // 暂时使用 this.scale 作为标记量
    this.color = this.scale
      ? value >= this.max || value <= this.min
        ? '#ffffff'
        : '#000000'
      : this.getLastColor();

    return this.getGui(this.background, this.color);
  }

  private getGui(background?, color?) {
    return (
      <Input
        {...normalizeInput(this.props.data, this.props.colDef).value}
        className={'tongyu-cell-container'}
        style={{
          background,
          color,
          height: this.props.context.rowHeight,
        }}
        raw={true}
        value={this.getNormalValue()}
        subtype="static"
      />
    );
  }

  private getLastValue() {
    return HeatmapCellRenderer.caches[this.getUnionCellId()];
  }

  private getLastBackground() {
    return HeatmapCellRenderer.backgroundCaches[this.getUnionCellId()];
  }

  private getLastColor() {
    return HeatmapCellRenderer.colorCaches[this.getUnionCellId()];
  }

  private getUnionCellId() {
    const { rowKey, unionId } = this.props.context;

    if (!unionId) {
      throw new Error('use of HeatmapCellRenderer, table props.unionId must be passed.');
    }

    return unionId + this.props.column.getColId() + this.getNormalData()[rowKey];
  }

  private getHeatColor(value) {
    if (!this.scale) return;

    return this.scale(_.toNumber(value));
  }

  private getNormalValue() {
    const value: IInputCellRendererValue = this.props.value;
    // omit moment object
    if (value && typeof value === 'object' && value.value) {
      return value.value;
    }
    return value;
  }

  private getNormalData() {
    return this.props.data || {};
  }

  // private getItemDom(className) {
  //   return this.props.eGridCell.getElementsByClassName(className)[0];
  // }
}
