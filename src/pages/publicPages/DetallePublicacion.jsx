// Este archivo presenta la información específica de un curso.
import { useParams } from 'react-router-dom'

function DetallePublicacion() {
  
  const { id } = useParams()
  
  return( 
  <section>
    <h1> Curso {id}</h1>
    <div className = "row">
      <div className = "col-md-6">Imagen</div>
      <div className = "col-md-6">Datos</div>
    </div>
  </section>)
    
}

export default DetallePublicacion
