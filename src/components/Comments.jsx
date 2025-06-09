import { useEffect, useState } from 'react';
import './Comments.css';

function Comments({ stationId, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingComment, setEditingComment] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:4000/api/comments/${stationId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [stationId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, station_id: stationId, comment })
    });
    const data = await res.json();
    if (res.ok) {
      setComment('');
      setMsg('¡Comentario enviado!');
      fetchComments();
    } else {
      setMsg(data.message);
    }
  };

  // Iniciar edición
  const startEdit = (id, currentComment) => {
    setEditingId(id);
    setEditingComment(currentComment);
  };

  // Guardar edición
  const handleEditSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4000/api/comments/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, comment: editingComment })
    });
    const data = await res.json();
    if (res.ok) {
      setEditingId(null);
      setEditingComment('');
      setMsg('¡Comentario editado!');
      fetchComments();
    } else {
      setMsg(data.message);
    }
  };

  // Iniciar eliminación
  const startDelete = (id) => {
    setDeletingId(id);
  };

  // Confirmar eliminación
  const handleDelete = async () => {
    setMsg('');
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4000/api/comments/${deletingId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('¡Comentario eliminado!');
      setDeletingId(null);
      fetchComments();
    } else {
      setMsg(data.message);
      setDeletingId(null);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeletingId(null);
  };

  return (
    <div className="comments-section">
      <h3>Comentarios de los usuarios</h3>
      {
        !user && (
          <p>Inicia sesión para dejar un comentario.</p>
        )
      }
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            required
          />
          <button type="submit">Enviar</button>
        </form>
      )}
      {msg && <p>{msg}</p>}
      <ul className="comments-list">
        {comments.map((c, idx) => (
          <li key={idx}>
            <strong>{c.username}</strong> <em>({new Date(c.created_at).toLocaleString()})</em>
            {editingId === c.id ? (
              <form onSubmit={handleEditSubmit} className="edit-comment-form">
                <textarea
                  value={editingComment}
                  onChange={e => setEditingComment(e.target.value)}
                  required
                />
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>
              </form>
            ) : (
              <div className="comment-row">
                <div>{c.comment}</div>
                {user && user === c.username && (
                  <>
                    <button
                      className="editar-comentario"
                      onClick={() => startEdit(c.id, c.comment)}
                    >
                      Editar
                    </button>
                    <button
                      className="eliminar-comentario"
                      onClick={() => startDelete(c.id)}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Modal de confirmación para eliminar */}
      {deletingId && (
        <div className="modal-confirm">
          <div className="modal-content">
            <p>¿Seguro que quieres eliminar este comentario?</p>
            <button className="confirm" onClick={handleDelete}>Confirmar</button>
            <button className="cancel" onClick={cancelDelete}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Comments;