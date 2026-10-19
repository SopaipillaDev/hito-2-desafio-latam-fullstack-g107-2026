function Nosotros() {
  return (
    <section className="bg-dark text-light min-vh-100">

      {/* Encabezado */}
      <section className="bg-dark py-5">
        <div className="container py-5">

          <div className="row justify-content-center text-center">
            <div className="col-12 col-lg-9 px-4 px-lg-5">

              <span className="text-primary fw-semibold">
                SOBRE NOSOTROS
              </span>

              <h1 className="display-4 fw-bold mt-3 mb-4">
                Una idea que nació para conectar
              </h1>

              <p className="lead text-body-secondary mb-0">
                Creamos este espacio pensando en una idea sencilla:
                hacer que encontrar, descubrir y compartir productos
                sea una experiencia mucho más fácil.
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* Nuestra historia */}
      <section className="bg-black py-5">

        <div className="container py-5">

          <div className="row justify-content-center">
            <div className="col-12 col-lg-9 px-4 px-lg-5">

              <div className="border-start border-primary border-3 ps-4 ps-lg-5">

                <span className="text-primary small fw-semibold">
                  NUESTRA HISTORIA
                </span>

                <h2 className="display-6 fw-bold mt-3 mb-4">
                  De una idea simple a un espacio para descubrir
                </h2>

                <p className="text-body-secondary fs-5">
                  Todo comenzó con una pregunta: ¿cómo podemos hacer
                  que buscar y encontrar productos sea una experiencia
                  más sencilla?
                </p>

                <p className="text-body-secondary fs-5">
                  A partir de esa idea nació nuestro marketplace, un
                  espacio pensado para reunir publicaciones en un solo
                  lugar y facilitar la forma en que las personas
                  exploran diferentes opciones.
                </p>

                <p className="text-body-secondary fs-5 mb-0">
                  Poco a poco fuimos construyendo una plataforma donde
                  la organización, la claridad y la facilidad de uso
                  fueran parte importante de la experiencia.
                </p>

              </div>

            </div>
          </div>

        </div>

      </section>

      {/* Lo que nos mueve */}
      <section className="bg-dark py-5">

        <div className="container py-5">

          <div className="row align-items-start g-5">

            <div className="col-12 col-lg-5 px-4 px-lg-5">

              <span className="text-primary fw-semibold">
                LO QUE NOS MUEVE
              </span>

              <h2 className="display-6 fw-bold mt-3 mb-4">
                Queremos hacer las cosas simples.
              </h2>

              <p className="text-body-secondary fs-5">
                Creemos que una buena experiencia no necesita ser
                complicada. Por eso buscamos que cada parte de nuestro
                marketplace sea clara, ordenada y fácil de utilizar.
              </p>

            </div>

            <div className="col-12 col-lg-6 offset-lg-1 px-4 px-lg-5">

              {/* Valor 1 */}
              <div className="d-flex gap-4 mb-5">

                <div className="flex-shrink-0">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: '56px', height: '56px' }}
                  >
                    <i className="bi bi-heart text-white fs-5"></i>
                  </div>
                </div>

                <div>
                  <h3 className="h5 mb-2">
                    Cercanía
                  </h3>

                  <p className="text-body-secondary mb-0">
                    Diseñamos pensando en las personas y en la forma
                    en que realmente utilizan una plataforma.
                  </p>
                </div>

              </div>

              {/* Valor 2 */}
              <div className="d-flex gap-4 mb-5">

                <div className="flex-shrink-0">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: '56px', height: '56px' }}
                  >
                    <i className="bi bi-stars text-white fs-5"></i>
                  </div>
                </div>

                <div>
                  <h3 className="h5 mb-2">
                    Simplicidad
                  </h3>

                  <p className="text-body-secondary mb-0">
                    Queremos que encontrar lo que buscas sea rápido,
                    claro y sin complicaciones.
                  </p>
                </div>

              </div>

              {/* Valor 3 */}
              <div className="d-flex gap-4">

                <div className="flex-shrink-0">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: '56px', height: '56px' }}
                  >
                    <i className="bi bi-lightbulb text-white fs-5"></i>
                  </div>
                </div>

                <div>
                  <h3 className="h5 mb-2">
                    Innovación
                  </h3>

                  <p className="text-body-secondary mb-0">
                    Buscamos constantemente nuevas formas de mejorar
                    la experiencia dentro de nuestro marketplace.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Cierre */}
      <section className="bg-black py-5">

        <div className="container py-5">

          <div className="row justify-content-center">

            <div className="col-12 col-lg-8 px-4 px-lg-5">

              <div className="border-top border-secondary pt-5 text-center">

                <h2 className="display-6 fw-bold mb-4">
                  Gracias por ser parte de esta historia.
                </h2>

                <p className="text-body-secondary fs-5 mb-4">
                  Te invitamos a conocer nuestras publicaciones y
                  descubrir todo lo que nuestro marketplace tiene
                  para ofrecer.
                </p>

                <a
                  href="/galeria"
                  className="btn btn-primary btn-lg px-5 py-3"
                >
                  Explorar la galería
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

    </section>
  )
}

export default Nosotros
