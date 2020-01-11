import * as d3 from 'd3'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 0, left: 130, right: 80, bottom: 0 }
const height = 500 - margin.top - margin.bottom
const width = 650 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([2012, 2018])
  .range([0, width])

const radiusScale = d3
  .scaleLinear()
  .domain([0, 195])
  .range([0, 50])

const yPositionScale = d3
  .scaleBand()
  .domain(['Staten Island', 'Manhattan', 'Queens', 'Bronx', 'Brooklyn'])
  .padding(1)
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
      d.cases +
      '</span>'
    )
  })
svg.call(tip)

d3.csv(require('../data/rape_cases.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'rape-circle')
    .attr('r', d => radiusScale(d.cases))
    .attr('cx', d => xPositionScale(d.year))
    .attr('cy', d => yPositionScale(d.burough))
    .attr('y', function(d) {
      return yPositionScale(d.victim)
    })
    .attr('fill', '#2a4c66')
    .attr('opacity', 0.3)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.format('d'))
    .ticks(6)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.y-axis path').remove()
  svg.selectAll('.x-axis path').remove()
  // svg.selectAll('.y-axis line').remove()
  svg.selectAll('.x-axis line').remove()
  svg.selectAll('.y-axis text').attr('dx', -40)
  svg.selectAll('.x-axis text').attr('dy', -40)

  svg
    .selectAll('.y-axis line')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.4)
    .attr('x2', width)
    .lower()

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    xPositionScale.range([0, newWidth])
    if (svgWidth < 500) {
      xAxis.ticks(4).tickValues([2012, 2014, 2016, 2018])
    } else {
      xAxis.ticks(8).tickValues([2012, 2013, 2014, 2015, 2016, 2017, 2018])
    }

    yPositionScale.range([newHeight, 0])

    svg
      .selectAll('.rape-circle')
      .attr('r', d => radiusScale(d.cases))
      .attr('cx', d => xPositionScale(d.year))
      .attr('cy', d => yPositionScale(d.burough))
      .attr('y', function(d) {
        return yPositionScale(d.victim)
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    svg
      .selectAll('.y-axis line')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.4)
      .attr('x2', newWidth)
      .lower()
    svg.selectAll('.x-axis').call(xAxis)
  }

  window.addEventListener('resize', render)

  render()
}
