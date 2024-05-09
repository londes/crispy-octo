import React from 'react'

function Icon({ name, alt='', className=''}) {
  return <img src={`/icons/${name}.svg`} alt={alt} className={className}/>
}

export default Icon;