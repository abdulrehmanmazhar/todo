import type { LanguageDefinition } from "./types";
import type { Messages } from "./en";

export const es: LanguageDefinition<Messages> = {
  id: "es",
  label: "Spanish",
  nativeLabel: "Español",
  direction: "ltr",
  locales: ["es"],
  messages: {
    common: {
      system: "Sistema",
      openSidebar: "Abrir barra lateral",
      collapseSidebar: "Contraer barra lateral",
      sendMessage: "Enviar mensaje",
      delete: "Eliminar",
      cancel: "Cancelar",
    },
    extensions: {
      home: {
        name: "Tareas",
        description: "Gestiona listas, prioridades y fechas de vencimiento",
      },
      settings: {
        name: "Ajustes",
        description: "Configurar preferencias del espacio de trabajo",
      },
    },
    home: {
      title: "Tareas",
      description:
        "Planifica el trabajo en listas con prioridades y fechas de vencimiento.",
      listDescription: "Tareas abiertas en esta lista.",
      placeholder: "¿Qué hay que hacer?",
      searchPlaceholder: "Buscar tareas…",
      loading: "Cargando tareas…",
      errorTitle: "No se pudieron cargar las tareas",
      errorDescription:
        "Comprueba que la extensión del backend esté conectada e inténtalo de nuevo.",
      emptyTitle: "No hay tareas aquí",
      emptyDescription:
        "Crea una tarea o cambia de vista desde el panel izquierdo.",
      emptyLists: "Aún no hay listas. Crea una para organizar el trabajo.",
      dueOn: "Vence el {date}",
      remaining: "{count} restantes",
      sections: {
        smart: "Vistas",
        lists: "Listas",
      },
      smart: {
        all: "Todas",
        inbox: "Bandeja",
        today: "Hoy",
        upcoming: "Próximas",
        completed: "Completadas",
      },
      smartDescriptions: {
        all: "Todas las tareas de tu espacio de trabajo.",
        inbox: "Tareas que aún no están en una lista.",
        today: "Vencen hoy — concéntrate en lo que importa ahora.",
        upcoming: "Programadas para más adelante esta semana y después.",
        completed: "Trabajo terminado que puedes archivar o borrar.",
      },
      filters: {
        all: "Todas",
        active: "Activas",
        completed: "Completadas",
      },
      sort: {
        created: "Más recientes",
        due: "Fecha de vencimiento",
        priority: "Prioridad",
        title: "Título",
      },
      priority: {
        none: "Ninguna",
        low: "Baja",
        medium: "Media",
        high: "Alta",
      },
      fields: {
        title: "Título",
        notes: "Notas",
        notesPlaceholder: "Añade contexto, enlaces o siguientes pasos…",
        list: "Lista",
        listName: "Nombre de la lista",
        listNamePlaceholder: "p. ej. Personal, Trabajo",
        color: "Color",
        priority: "Prioridad",
        dueDate: "Fecha de vencimiento",
        noDueDate: "Sin fecha",
        today: "Hoy",
        clearDueDate: "Borrar",
        status: "Estado",
      },
      dialog: {
        createTitle: "Nueva tarea",
        createDescription:
          "Captura el trabajo y luego asigna lista, prioridad y fecha de vencimiento.",
        editTitle: "Editar tarea",
        editDescription: "Actualiza los detalles y mantén tu plan al día.",
        createListTitle: "Nueva lista",
        createListDescription:
          "Agrupa tareas relacionadas bajo una lista con nombre.",
        renameListTitle: "Renombrar lista",
        renameListDescription:
          "Actualiza el nombre de la lista o el color de acento.",
      },
      detail: {
        title: "Detalles",
        empty: "Selecciona una tarea para ver notas, agenda y lista.",
        noNotes: "Aún no hay notas.",
        noDueDate: "Sin fecha de vencimiento",
        updated: "Actualizado el {date}",
      },
      actions: {
        add: "Añadir",
        save: "Guardar",
        edit: "Editar tarea",
        markDone: "Marcar como hecha",
        markActive: "Marcar como activa",
        clearCompleted: "Borrar completadas ({count})",
        newList: "Nueva lista",
        renameList: "Renombrar lista",
        deleteList: "Eliminar lista",
      },
      toasts: {
        empty: "Notificación",
        successTitle: "Listo",
        errorTitle: "Algo salió mal",
        error: "La solicitud falló.",
        created: "Tarea creada.",
        updated: "Tarea actualizada.",
        deleted: "Tarea eliminada.",
        markedDone: "Marcada como hecha.",
        markedActive: "Marcada como activa.",
        cleared: "Se borraron {count} tareas completadas.",
        listCreated: "Lista creada.",
        listUpdated: "Lista actualizada.",
        listDeleted: "Lista eliminada.",
      },
    },
    settings: {
      title: "Ajustes",
      tabs: {
        themes: "Temas",
      },
      themes: {
        title: "Temas",
        description:
          "Configura la apariencia, el color de acento y el idioma del espacio de trabajo.",
        appearance: {
          title: "Apariencia",
          description:
            "Elige claro, oscuro o sigue la preferencia del sistema.",
          light: "Claro",
          dark: "Oscuro",
          system: "Sistema",
        },
        colorTheme: {
          title: "Tema de color",
          description:
            "Elige un color de acento aplicado en el espacio de trabajo.",
          default: "Predeterminado",
          blue: "Azul",
          green: "Verde",
          violet: "Violeta",
          orange: "Naranja",
          rose: "Rosa",
        },
        language: {
          title: "Idioma",
          description:
            "Elige un idioma o sigue el sistema. Los idiomas RTL ajustan la dirección automáticamente.",
          system: "Sistema",
        },
      },
    },
  },
};
