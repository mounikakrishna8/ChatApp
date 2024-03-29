import particlesConfig from '../../particles.config';
import React from 'react';
import { useEffect, useState, memo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log('Particles loaded:', container);
  };

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          // the particlesconfig.js contains all the json required for particleJS
          options={particlesConfig}
        />
      )}
    </>
  );
};

export default React.memo(ParticlesBackground);
