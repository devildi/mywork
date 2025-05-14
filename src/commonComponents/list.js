import React, { useState, useEffect, useCallback } from 'react';
import Bar from '../components/appbar';
import { connect } from 'react-redux';

const List = ({dispatch, history}) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pre, setPre] = useState(0);

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // 检查是否滚动到底部（距离底部50px以内）
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        if(trips.length - pre === 20 && loading === false) {
            console.log('Loading more trips...');
            setLoading(true);
            fetchTrips(page + 1);
            setPage(page + 1);
        }
    }
  }, [pre, trips.length, loading, page]);

  useEffect(() => {
    setLoading(true)
    fetchTrips(page);
  }, [page]);

  const fetchTrips = async (index) => {
    try {
      const response = await fetch(`/api/trip/getAllTrip?page=${index}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json()
      setTrips([...data]);
      setLoading(false);
      if(index > 1) {
        setPre(trips.length);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const handleImageClick = (trip) => {
    console.log(trip);
    history.push({pathname: '/show', params: trip});
  }

  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Bar title={'行程列表'} history={history}/>
      <div style={{ margin: 0, paddingTop: '50px' }}>
        {trips.map((trip, index) => (
          <div 
            key={index} 
            style={{ 
              position: 'relative', 
              margin: 0, 
              padding: 0,
              cursor: 'pointer' 
            }}
            onClick={() => handleImageClick(trip)}
          >
            {trip.detail && trip.detail[0] && trip.detail[0][0].picURL && (
              <>
                <img 
                  src={trip.detail[0][0].picURL} 
                  alt={`Trip ${index}`}
                  style={{ 
                    height: '150px', 
                    width: '100%', 
                    objectFit: 'cover',
                    display: 'block',
                    margin: 0,
                    padding: 0
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                }}>
                  <h2 style={{ margin: 0 }}>{trip.tripName}</h2>
                  <p style={{ margin: '8px 0 0 0' }}>{`by:${trip.designer}`}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(List);