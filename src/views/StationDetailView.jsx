import { useParams, Link, useLocation } from 'react-router-dom';
import Comments from './Comments';

import '@styles/stationDetail.css'
import '@styles/form.css'


function StationDetail({ stations, user }) {
  const location = useLocation();
  console.log(location);
  const {gobackLink} = location.state;

  const { id } = useParams();
  // Buscamos la estación por su ID:
  const station = stations.find(s => s.IDEESS === id);

  if (!station) return <div>Estación no encontrada</div>;

  return (
    <div className='station-detail'>
      <h1>Detalles de la Estación </h1>
      <h2>{station['Rótulo']}</h2>
      <p><strong>Dirección:</strong> {station['Dirección']}</p>
      <p><strong>Municipio:</strong> {station['Municipio']}</p>
      <p><strong>Gasóleo A:</strong> {station['Precio Gasoleo A']}</p>
      <p><strong>Gasolina 95 E5:</strong> {station['Precio Gasolina 95 E5']}</p>
      
      <Link to={gobackLink}> &lt;&lt; Volver
      </Link>

      <Comments stationId={station.IDEESS} user={user} />
    </div>
  );
}

export default StationDetail;