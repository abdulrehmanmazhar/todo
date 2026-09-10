import type { LanguageDefinition } from "./types";
import type { Messages } from "./en";

export const fr: LanguageDefinition<Messages> = {
  id: "fr",
  label: "French",
  nativeLabel: "Français",
  direction: "ltr",
  locales: ["fr"],
  messages: {
    common: {
      system: "Système",
      openSidebar: "Ouvrir la barre latérale",
      collapseSidebar: "Réduire la barre latérale",
      sendMessage: "Envoyer le message",
      delete: "Supprimer",
      cancel: "Annuler",
    },
    extensions: {
      home: {
        name: "Tâches",
        description: "Gérer les listes, priorités et échéances",
      },
      settings: {
        name: "Paramètres",
        description: "Configurer les préférences de l’espace de travail",
      },
    },
    home: {
      title: "Tâches",
      description:
        "Planifiez le travail par listes avec priorités et échéances.",
      listDescription: "Tâches ouvertes dans cette liste.",
      placeholder: "Que faut-il faire ?",
      searchPlaceholder: "Rechercher des tâches…",
      loading: "Chargement des tâches…",
      errorTitle: "Impossible de charger les tâches",
      errorDescription:
        "Vérifiez que l’extension backend est connectée, puis réessayez.",
      emptyTitle: "Aucune tâche ici",
      emptyDescription:
        "Créez une tâche ou changez de vue depuis le panneau de gauche.",
      emptyLists:
        "Aucune liste pour l’instant. Créez-en une pour organiser le travail.",
      dueOn: "Échéance le {date}",
      remaining: "{count} restantes",
      sections: {
        smart: "Vues",
        lists: "Listes",
      },
      smart: {
        all: "Toutes",
        inbox: "Boîte de réception",
        today: "Aujourd’hui",
        upcoming: "À venir",
        completed: "Terminées",
      },
      smartDescriptions: {
        all: "Toutes les tâches de votre espace de travail.",
        inbox: "Tâches qui ne sont pas encore dans une liste.",
        today: "À faire aujourd’hui — concentrez-vous sur l’essentiel.",
        upcoming: "Planifiées pour plus tard cette semaine et au-delà.",
        completed: "Travail terminé que vous pouvez archiver ou effacer.",
      },
      filters: {
        all: "Toutes",
        active: "Actives",
        completed: "Terminées",
      },
      sort: {
        created: "Plus récentes",
        due: "Date d’échéance",
        priority: "Priorité",
        title: "Titre",
      },
      priority: {
        none: "Aucune",
        low: "Basse",
        medium: "Moyenne",
        high: "Haute",
      },
      fields: {
        title: "Titre",
        notes: "Notes",
        notesPlaceholder: "Ajoutez du contexte, des liens ou les prochaines étapes…",
        list: "Liste",
        listName: "Nom de la liste",
        listNamePlaceholder: "p. ex. Personnel, Travail",
        color: "Couleur",
        priority: "Priorité",
        dueDate: "Date d’échéance",
        noDueDate: "Sans échéance",
        today: "Aujourd’hui",
        clearDueDate: "Effacer",
        status: "Statut",
      },
      dialog: {
        createTitle: "Nouvelle tâche",
        createDescription:
          "Capturez le travail, puis assignez liste, priorité et échéance.",
        editTitle: "Modifier la tâche",
        editDescription: "Mettez à jour les détails et gardez votre plan à jour.",
        createListTitle: "Nouvelle liste",
        createListDescription:
          "Regroupez des tâches liées sous une liste nommée.",
        renameListTitle: "Renommer la liste",
        renameListDescription:
          "Mettez à jour le nom de la liste ou la couleur d’accent.",
      },
      detail: {
        title: "Détails",
        empty:
          "Sélectionnez une tâche pour consulter notes, planning et liste.",
        noNotes: "Aucune note pour l’instant.",
        noDueDate: "Pas d’échéance",
        updated: "Mis à jour le {date}",
      },
      actions: {
        add: "Ajouter",
        save: "Enregistrer",
        edit: "Modifier la tâche",
        markDone: "Marquer comme terminée",
        markActive: "Marquer comme active",
        clearCompleted: "Effacer les terminées ({count})",
        newList: "Nouvelle liste",
        renameList: "Renommer la liste",
        deleteList: "Supprimer la liste",
      },
      toasts: {
        empty: "Notification",
        successTitle: "Terminé",
        errorTitle: "Une erreur s’est produite",
        error: "La requête a échoué.",
        created: "Tâche créée.",
        updated: "Tâche mise à jour.",
        deleted: "Tâche supprimée.",
        markedDone: "Marquée comme terminée.",
        markedActive: "Marquée comme active.",
        cleared: "{count} tâches terminées effacées.",
        listCreated: "Liste créée.",
        listUpdated: "Liste mise à jour.",
        listDeleted: "Liste supprimée.",
      },
    },
    settings: {
      title: "Paramètres",
      tabs: {
        themes: "Thèmes",
      },
      themes: {
        title: "Thèmes",
        description:
          "Configurez l’apparence, la couleur d’accent et la langue de votre espace de travail.",
        appearance: {
          title: "Apparence",
          description:
            "Choisissez clair, sombre, ou suivez la préférence système.",
          light: "Clair",
          dark: "Sombre",
          system: "Système",
        },
        colorTheme: {
          title: "Thème de couleur",
          description:
            "Choisissez une couleur d’accent appliquée à l’espace de travail.",
          default: "Par défaut",
          blue: "Bleu",
          green: "Vert",
          violet: "Violet",
          orange: "Orange",
          rose: "Rose",
        },
        language: {
          title: "Langue",
          description:
            "Choisissez une langue ou suivez le système. Les langues RTL définissent automatiquement la direction.",
          system: "Système",
        },
      },
    },
  },
};
