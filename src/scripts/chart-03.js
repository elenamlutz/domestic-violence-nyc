import * as d3 from 'd3'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 60, left: 60, right: 80, bottom: 60 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleBand()
  .domain([2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([height, 0])

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return (
      "<b><span style='color:white'>" +
      d.year +
      '</b>' +
      '<br>' +
      "Number of Cases: <span style='color:white'>" +
      d.domestic_homicide +
      '</span>'
    )
  })
svg.call(tip)

d3.csv(require('../data/homicides.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .selectAll('.homicides-rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('class', 'homicides-rect')
    .attr('width', 30)
    .attr('x', function(d) {
      return xPositionScale(d.year)
    })
    .attr('height', function(d) {
      return height - yPositionScale(d.domestic_homicide)
    })
    .attr('y', function(d) {
      return yPositionScale(d.domestic_homicide)
    })
    .attr('fill', '#FC8D6D')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  const yAxis = d3.axisLeft(yPositionScale).ticks(6)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.format('d'))
    .ticks(10)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.y-axis path').remove()
  svg.selectAll('.x-axis path').remove()
  svg.selectAll('.x-axis line').remove()
  svg.selectAll('.y-axis line').remove()
  svg.selectAll('.y-axis text').attr('dx', -20)
  svg.selectAll('.x-axis text').attr('dx', -15)
  svg.selectAll('.x-axis text').attr('dy', 20)

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = height + margin.top + margin.bottom

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    xPositionScale.range([0, newWidth])
    if (svgWidth < 500) {
      xAxis.ticks(5).tickValues([2011, 2013, 2015, 2017, 2019])
    } else {
      xAxis
        .ticks(11)
        .tickValues([
          2010,
          2011,
          2012,
          2013,
          2014,
          2015,
          2016,
          2017,
          2018,
          2019
        ])
    }
    if (svgWidth < 500) {
      svg.selectAll('.homicides-rect').attr('width', 20)
    } else {
      svg.selectAll('.homicides-rect').attr('width', 30)
    }
    if (svgWidth < 500) {
      svg.selectAll('.x-axis text').attr('dx', -5)
    }

    yPositionScale.range([newHeight, 0])

    svg
      .selectAll('.homicides-rect')
      .attr('x', function(d) {
        return xPositionScale(d.year)
      })
      .attr('height', function(d) {
        return height - yPositionScale(d.domestic_homicide)
      })
      .attr('y', function(d) {
        return yPositionScale(d.domestic_homicide)
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    svg.selectAll('.x-axis').call(xAxis)
    svg.selectAll('.y-axis path').remove()
    svg.selectAll('.x-axis path').remove()
    svg.selectAll('.x-axis line').remove()
    svg.selectAll('.y-axis line').remove()
  }

  window.addEventListener('resize', render)
}
