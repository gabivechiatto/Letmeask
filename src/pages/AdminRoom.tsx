import { FormEvent, useState } from 'react';
import { useParams } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';
import { Question } from '../components/Question';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';

import LogoImg from '../assets/images/logo.svg';
import DeleteImg from '../assets/images/delete.svg';
import CheckImg from '../assets/images/check.svg'
import AnswerImg from '../assets/images/answer.svg'

import '../styles/room.scss';


type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

   async function handleCheckQuestionHasAnswered(questionId: string) {     
       await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
       });
     
   }

    async function handleHighlightQuestion(questionId: string) {      
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isHighlighted: true,
        });
      
    }

  async function handleDeleteQuestion(questionId: string){
   if (window.confirm('Tem certeza que deseja remover essa questão?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
   }
  }

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado!');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },

      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id='page-room'>
      <Toaster position='top-center' reverseOrder={true} />
      <header>
        <div className='content'>
          <img src={LogoImg} alt='Letmeask' />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className='question-list'>
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                      <button
                      type='button'
                      onClick={() => handleCheckQuestionHasAnswered(question.id)}
                    >
                      <img src={CheckImg} alt='Marcar pergunta como respondida' />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={AnswerImg} alt='Destacar pergunta' />
                    </button>
                  </>
                )}
                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={DeleteImg} alt='Remover pergunta' />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
