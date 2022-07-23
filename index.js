import * as d3 from "https://cdn.skypack.dev/d3@7"

fetch ('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(data => renderChart(data.data))

const renderChart = dataset => {

  const barPadding = 0

const w = 1300
const h = 700
const chartPadding = 70

const container = document.getElementById('container')

const svg = d3.select(container)
                .append('svg')
                  .attr('id', 'svg')
                  .attr('width', w - barPadding)
                  .attr('height', h)
                  .style('background', 'white')


const barWidth = ((w - (chartPadding * 2)) / dataset.length) - barPadding

const scaleX = d3.scaleTime()
                  .domain(d3.extent(dataset, (d) => new Date(d[0])) )
                  .range([chartPadding, w - barPadding - chartPadding])

const scaleY = d3.scaleLinear()
                  .domain([0, d3.max(dataset, (d) => d[1])])
                  .range([h - chartPadding, chartPadding])

const formatTooltipDate = (date) => {

  const regExMonth = /(?<=\-)\d\d(?=\-)/
  const year = date.substring(0, 4)
  const month = date.match(regExMonth).toString()

  let quarter
  switch (month) {
    case '01':
      quarter = 'Quarter 1'
      break
    case '04':
      quarter = 'Quarter 2'
      break
    case '07':
      quarter = 'Quarter 3'
      break
    case '10':
      quarter = 'Quarter 4'
      break
    default:
      break
  }

  return year + ' ' + quarter
}

const formatGDP = (gdp) => {
  
  const regEx = /\./
  if (!regEx.test(gdp)) {
    if (gdp.length > 3) {
      return gdp.slice(0, gdp.length - 3) + ',' + gdp.slice(gdp.length - 3)
    }
    return gdp
  }
  
  if (gdp.length > 5) {
    return gdp.slice(0, gdp.length - 5) + ',' + gdp.slice(gdp.length - 5)
  }
  return gdp
}

const positionTooltip = (potentialPlacement) => {

  if ((potentialPlacement + 250) > document.getElementById('svg').getBoundingClientRect().width) {
    return potentialPlacement - 350
  }
  return potentialPlacement
}

svg.selectAll('rect')
    .data(dataset)
    .enter()
  .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('width', barWidth)
    .attr('height', (d) => h - scaleY(d[1]) - chartPadding)
    .attr('x', (d, i) => i * (barWidth + barPadding) + chartPadding)
    .attr('y', (d) => scaleY(d[1]))
    .attr('fill', 'rgb(39, 80, 204)')
    .attr('stroke', 'white')
    .attr('stroke-width', .5)
    .on('mouseover',  function(e) {
      const tooltip = d3.select(document.getElementById('svg'))
        .append('g')
          .attr('id', 'tooltip')
          .attr('class', 'tooltip')
          .attr('data-date', this.getAttribute('data-date'))
          .attr('transform', 'translate(' + (positionTooltip(Number(this.getAttribute('x')) + 50)) + ', ' + (h - 200) + ')')
        
        tooltip.append('rect')
          .attr('rx', 15)
          .attr('ry', 15)
          .attr('id', 'tooltip-rect')
          .attr('width', 250)
          .attr('height', 100)
          .attr('fill', 'rgb(153, 204, 232)')
          .attr('fill-opacity', '.8')

        tooltip.append('text')
        .attr('x', document.getElementById('tooltip-rect').getAttribute('width') / 2)
        .attr('y', document.getElementById('tooltip-rect').getAttribute('height') / 2.5)
        .attr('text-anchor', 'middle')
        .attr('id', 'tooltip-date')
        .attr('class', 'tooltip-text')
        .text(formatTooltipDate(this.getAttribute('data-date')))

        tooltip.append('text')
        .attr('x', document.getElementById('tooltip-rect').getAttribute('width') / 2)
        .attr('y', document.getElementById('tooltip-rect').getAttribute('height') / 2.5 + 25)
        .attr('text-anchor', 'middle')
        .attr('id', 'tooltip-date')
        .attr('class', 'tooltip-text')
        .text(`$${formatGDP(this.getAttribute('data-gdp'))} Billion`)
    })

    .on('mouseout', function(e) {
      document.querySelector('.tooltip').remove()
    })


const axisX = d3.axisBottom(scaleX)
const axisY = d3.axisLeft(scaleY)

svg.append('g')
  .attr('transform', `translate(0, ${h - chartPadding})`)
  .attr('id', 'x-axis')
  .attr('class', 'axis')
  .call(axisX)

svg.append('g')
  .attr('id', 'y-axis')
  .attr('class', 'axis')
  .attr('transform', `translate(${chartPadding}, 0)`)
  .call(axisY)
}

