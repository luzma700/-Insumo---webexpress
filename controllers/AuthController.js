const db = require('../db/conexion');

class AuthController {
  loginVista(req, res) {
    res.render('login', { error: null });
  }

  login(req, res) {
    const { email, clave } = req.body;

    const sql = `
      SELECT usuarios.*, roles.nombre AS rol_nombre
      FROM usuarios
      JOIN roles ON usuarios.rol_id = roles.id
      WHERE email = ? AND clave = ?
    `;

    db.query(sql, [email, clave], (err, resultados) => {
      if (err) throw err;

      if (resultados.length > 0) {
        const usuario = resultados[0];
        req.session.usuario = {
          rut: usuario.rut,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol_nombre
        };
        res.redirect('/usuarios');
      } else {
        res.render('login', { error: 'Email o clave incorrectos' });
      }
    });
  }

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
}

module.exports = new AuthController();
